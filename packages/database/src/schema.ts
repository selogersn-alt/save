import { pgTable, uuid, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const extractions = pgTable('extractions', {
  id: uuid('id').defaultRandom().primaryKey(),
  url: varchar('url', { length: 2048 }).notNull(),
  platform: varchar('platform', { length: 255 }),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, processing, completed, failed
  result: jsonb('result'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: varchar('content').notNull(),
  metaDescription: varchar('meta_description', { length: 500 }),
  isPublished: varchar('is_published', { length: 10 }).default('true'), // boolean as varchar for simplicity
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const settings = pgTable('settings', {
  key: varchar('key', { length: 255 }).primaryKey(),
  value: varchar('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
