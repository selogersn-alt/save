import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { Readable } from 'stream';
import cors from '@fastify/cors';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { z } from 'zod';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { getDb, extractions, posts, settings } from '@telechargeur/database';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-admin-panel');

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, { origin: '*' });

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisConnection = new Redis({ host: REDIS_HOST, port: REDIS_PORT, maxRetriesPerRequest: null });

const extractionQueue = new Queue('extraction', { connection: redisConnection as any });

const db = getDb(process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/telechargeur');

// --- ROUTES AUTH (ADMIN) ---
app.post('/api/auth/setup', {
  schema: { body: z.object({ password: z.string().min(6) }) }
}, async (request, reply) => {
  const { password } = request.body;
  
  const existing = await db.select().from(settings).where(eq(settings.key, 'admin_pwd'));
  if (existing.length > 0) {
    return reply.status(403).send({ error: 'Admin account already setup.' });
  }

  const hash = await bcrypt.hash(password, 10);
  await db.insert(settings).values({ key: 'admin_pwd', value: hash });
  
  const token = await new jose.SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
    
  return { token };
});

app.post('/api/auth/login', {
  schema: { body: z.object({ password: z.string() }) }
}, async (request, reply) => {
  const { password } = request.body;
  
  const existing = await db.select().from(settings).where(eq(settings.key, 'admin_pwd'));
  if (existing.length === 0) {
    return reply.status(404).send({ error: 'No admin account found. Please setup first.' });
  }

  const hash = existing[0].value;
  const isValid = await bcrypt.compare(password, hash);
  
  if (!isValid) {
    return reply.status(401).send({ error: 'Invalid password' });
  }

  const token = await new jose.SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
    
  return { token };
});

app.get('/api/auth/verify', async (request, reply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Missing token' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    await jose.jwtVerify(token, JWT_SECRET);
    return { valid: true };
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid token' });
  }
});

app.post(
  '/api/extract',
  {
    schema: {
      body: z.object({ 
        url: z.string().url(),
        action: z.enum(['video', 'audio', 'summary', 'auto', 'image']).optional().default('auto')
      }),
      response: {
        200: z.object({ id: z.string(), message: z.string() })
      }
    }
  },
  async (request, reply) => {
    const { url, action } = request.body;
    
    // 1. Insert into DB
    const [record] = await db.insert(extractions).values({ url }).returning();
    
    // 2. Add to BullMQ
    await extractionQueue.add('extract-video', { id: record.id, url, action });
    
    return { id: record.id, message: 'Extraction started' };
  }
);

app.get(
  '/api/status/:id',
  {
    schema: {
      params: z.object({ id: z.string().uuid() }),
      response: {
        200: z.object({
          id: z.string(),
          status: z.string(),
          result: z.any()
        }),
        404: z.object({ error: z.string() })
      }
    }
  },
  async (request, reply) => {
    const { id } = request.params;
    
    const records = await db.select().from(extractions).where(eq(extractions.id, id));
    if (records.length === 0) {
      return reply.status(404).send({ error: 'Not found' });
    }
    
    const record = records[0];
    return {
      id: record.id,
      status: record.status,
      result: record.result
    };
  }
);

// --- DOWNLOAD PROXY (BYPASSReferer/CORS 403 Forbidden) ---
app.get(
  '/api/download-proxy',
  {
    schema: {
      querystring: z.object({
        url: z.string(),
        filename: z.string().optional()
      })
    }
  },
  async (request, reply) => {
    const { url, filename } = request.query;
    // Empêcher le navigateur de transmettre le referer de notre site lors d'une redirection,
    // ce qui évite les blocages "Access Denied" (403) par des CDN comme Akamai (TikTok, etc.)
    reply.header('Referrer-Policy', 'no-referrer');
    try {
      request.log.info(`Proxying download from: ${url}`);
      
      // Détermination intelligente et précise du Referer en fonction du CDN hôte
      let referer: string | undefined = undefined;
      const lowerUrl = url.toLowerCase();
      
      if (lowerUrl.includes('tiktok') || lowerUrl.includes('tiktokv') || lowerUrl.includes('byteoversea') || lowerUrl.includes('ibyteimg')) {
        referer = 'https://www.tiktok.com/';
      } else if (lowerUrl.includes('instagram') || lowerUrl.includes('cdninstagram')) {
        referer = 'https://www.instagram.com/';
      } else if (lowerUrl.includes('youtube') || lowerUrl.includes('youtu.be') || lowerUrl.includes('googlevideo')) {
        referer = 'https://www.youtube.com/';
      } else if (lowerUrl.includes('facebook') || lowerUrl.includes('fbcdn') || lowerUrl.includes('fbsbx')) {
        referer = 'https://www.facebook.com/';
      }

      const headers: Record<string, string> = {
        'User-Agent': (request.headers['user-agent'] as string) || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Connection': 'keep-alive'
      };

      if (referer) {
        headers['Referer'] = referer;
      }

      const res = await fetch(url, { headers });
      
      if (!res.ok) {
        request.log.warn(`CDN fetch failed with status ${res.status}. Falling back to direct redirect to CDN.`);
        // STRATÉGIE DE REPLI DIRECTE : Si le proxy échoue, on redirige l'utilisateur vers le CDN d'origine au lieu de télécharger un fichier JSON corrompu !
        return reply.redirect(url);
      }

      const contentType = res.headers.get('content-type') || 'application/octet-stream';
      const finalFilename = filename || `media-${Date.now()}`;

      reply.header('Content-Type', contentType);
      reply.header('Content-Disposition', `attachment; filename="${encodeURIComponent(finalFilename)}"`);
      
      // Node 22 native fetch returns a Web ReadableStream.
      // Drizzle/Fastify expects a Node Readable stream, which we convert here.
      if (res.body) {
        const nodeStream = Readable.fromWeb(res.body as any);
        return reply.send(nodeStream);
      } else {
        request.log.warn('Response body is empty. Redirecting to direct CDN URL.');
        return reply.redirect(url);
      }
    } catch (err: any) {
      request.log.error(err, 'Proxy download failed. Redirecting to direct CDN URL.');
      // STRATÉGIE DE REPLI DIRECTE : En cas d'erreur serveur, on redirige l'utilisateur vers le CDN d'origine au lieu de télécharger un fichier JSON corrompu !
      try {
        return reply.redirect(url);
      } catch {
        return reply.status(500).send({ error: `Proxy download server error: ${err.message}` });
      }
    }
  }
);

// --- ROUTES BLOG (SEO) ---
app.get('/api/posts', async (request, reply) => {
  const allPosts = await db.select().from(posts);
  return allPosts;
});

// Middleware de vérification JWT pour les routes protégées
const verifyAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    await jose.jwtVerify(token, JWT_SECRET);
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized: Invalid token' });
  }
};

app.post(
  '/api/posts',
  {
    preHandler: verifyAdmin,
    schema: {
      body: z.object({ title: z.string(), slug: z.string(), content: z.string(), metaDescription: z.string() })
    }
  },
  async (request, reply) => {
    const data = request.body;
    const [record] = await db.insert(posts).values(data).returning();
    return record;
  }
);

// --- ROUTES SETTINGS (ADS & CONFIG) ---
app.get('/api/settings', async (request, reply) => {
  const allSettings = await db.select().from(settings);
  // Convert to object { key: value }
  return allSettings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
});

app.post(
  '/api/settings',
  {
    preHandler: verifyAdmin,
    schema: {
      body: z.object({ key: z.string(), value: z.string() })
    }
  },
  async (request, reply) => {
    const { key, value } = request.body;
    const [record] = await db.insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } })
      .returning();
    return record;
  }
);

const bootstrapDb = async () => {
  app.log.info('Bootstrapping database schema...');
  try {
    // 1. Create settings table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value VARCHAR NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    
    // 2. Create posts table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content VARCHAR NOT NULL,
        meta_description VARCHAR(500),
        is_published VARCHAR(10) DEFAULT 'true',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // 3. Create extractions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS extractions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        url VARCHAR(2048) NOT NULL,
        platform VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        result JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    
    // 4. Injecter les cookies Instagram directement en base de données pour une activation instantanée sans panneau admin !
    const cookiesText = `# Netscape HTTP Cookie File\n# https://curl.haxx.se/rfc/cookie_spec.html\n# This is a generated file! Do not edit.\n\n.instagram.com\tTRUE\t/\tTRUE\t1814628854\tcsrftoken\tlJJEMfeAWK4aBj_x9Z2aU8\n.instagram.com\tTRUE\t/\tTRUE\t1814628821\tdatr\t1LEZajdslxx2X89fc1i2HUG_\n.instagram.com\tTRUE\t/\tTRUE\t1811604821\tig_did\tEBDB1A61-3534-462A-AEDA-FB7DBA07CB26\n.instagram.com\tTRUE\t/\tTRUE\t1814628821\tmid\tahmx1AALAAHGFWBAhDwm39qM0wqm\n.instagram.com\tTRUE\t/\tTRUE\t1780673657\tdpr\t1.25\n.instagram.com\tTRUE\t/\tTRUE\t1780673657\twd\t1536x695\n.instagram.com\tTRUE\t/\tTRUE\t1787844854\tds_user_id\t3950261380\n.instagram.com\tTRUE\t/\tTRUE\t1811604841\tsessionid\t3950261380%3ATm9CTG6ucIxPe0%3A8%3AAYjjXxHj7lMpm_N1kUGCQiG62MERnYiKN8WA0RecFQ\n.instagram.com\tTRUE\t/\tTRUE\t0\trur\t"LDC\\0543950261380\\0541811604854:01ff07daa5a827f3620c9759b2d64840b31b932c496e2eaa16b098a2307f30c23b12bcf6"`;

    await db.insert(settings)
      .values({ key: 'instagram_cookies', value: cookiesText })
      .onConflictDoUpdate({ target: settings.key, set: { value: cookiesText, updatedAt: new Date() } });
      
    // 5. Réinitialiser le mot de passe d'administration par défaut pour vous permettre de vous connecter : digitalh2026
    const defaultHash = await bcrypt.hash('digitalh2026', 10);
    await db.insert(settings)
      .values({ key: 'admin_pwd', value: defaultHash })
      .onConflictDoUpdate({ target: settings.key, set: { value: defaultHash, updatedAt: new Date() } });

    app.log.info('Database schema bootstrapped and Instagram cookies seeded successfully.');
  } catch (err) {
    app.log.error(err, 'Failed to bootstrap database');
  }
};

const start = async () => {
  try {
    // Run DB bootstrap automatically
    await bootstrapDb();

    const port = parseInt(process.env.PORT || '3001', 10);
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`API running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
