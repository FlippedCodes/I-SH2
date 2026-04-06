// file is only used to create drizzle migrations
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DBhost,
    port: parseInt(<string>process.env.DBport, 10) || 5432,
    database: process.env.DBusername,
    user: process.env.DBusername,
    password: process.env.DBpassword,
  },
});
