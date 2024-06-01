import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './db/migration',
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(<string>process.env.DB_PORT, 10) || 3306,
  },
} satisfies Config;
