import fastify from 'fastify';
import cors from '@fastify/cors';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { z } from 'zod';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { getDb, extractions, posts, settings } from '@telechargeur/database';
import { eq } from 'drizzle-orm';

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, { origin: '*' });

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const redisConnection = new Redis({ host: REDIS_HOST, port: REDIS_PORT, maxRetriesPerRequest: null });

const extractionQueue = new Queue('extraction', { connection: redisConnection as any });

const db = getDb(process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/telechargeur');

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

app.post(
  '/api/posts',
  {
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

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10);
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`API running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
