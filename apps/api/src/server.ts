import fastify, { FastifyRequest, FastifyReply } from 'fastify';
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
        action: z.enum(['video', 'audio', 'summary']).optional().default('video')
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
    
    app.log.info('Database schema bootstrapped successfully.');
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
