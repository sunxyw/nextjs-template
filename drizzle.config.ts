import type { Config } from 'drizzle-kit';

/** @type {import('drizzle-kit').Config} */
export default {
  out: './migrations',
  schema: './src/models/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL ?? '',
  },
} satisfies Config;
