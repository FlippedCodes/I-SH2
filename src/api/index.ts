import { Hono } from 'hono';

import { logger } from 'hono/logger';

import { basicAuth } from 'hono/basic-auth';

// import { swaggerUI } from '@hono/swagger-ui';

import { migrate } from 'drizzle-orm/mysql2/migrator';

import { db } from './db/connect';

// import { initModels } from './db/models/init-models';

import v1 from './routes/v1/index';

const DEBUG = process.env.NODE_ENV === 'development';

const port = DEBUG ? 8080 : 3000;

const app = new Hono();

if (DEBUG) app.use(logger());

// TODO: Add API token identifier

if (!DEBUG) {
  app.use(
    '*',
    basicAuth({
      username: 'app',
      password: process.env.apiToken,
    }),
  );
}

// TODO: Fix swaggerUI
// app.get('/ui', swaggerUI({ url: '/doc' }));

// main API v1
app.route('/v1', v1);

app.notFound((c) => c.json({
  status: 'error',
  message: `Route: ${c.req.url} does not exist on this server.`,
}, 404));

console.debug(`🚀 API started successfully on port ${port}!`);

// db setup and connect
await migrate(db, { migrationsFolder: './db/migration' });
console.debug('🛢️ Synced database successfully!');

export { DEBUG, app };

export default { port, fetch: app.fetch };
