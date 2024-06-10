import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/server/schema/*',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    // url: 'file:test.db'
    url: process.env.DATABASE_URL ?? '',
    authToken: process.env.DATABASE_AUTH_TOKEN ?? ''
  }
} satisfies Config;
