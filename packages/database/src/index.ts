import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export * from './schema';

// connection string should be provided via environment variables in the consuming app
export const getDb = (connectionString: string) => {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
};
