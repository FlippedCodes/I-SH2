import { OpenAPIHono } from '@hono/zod-openapi';

import { swaggerUI } from '@hono/swagger-ui';

import { logger } from 'hono/logger';

import { basicAuth } from 'hono/basic-auth';

import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { drizzle } from 'drizzle-orm/node-postgres';

import packageInf from '../package.json';

import v1 from './routes/v1/index';

export const db = drizzle(`postgresql://${process.env.DBusername}:${process.env.DBpassword}@${process.env.DBhost}:${parseInt(<string>process.env.DBport, 10) || 5432}/${process.env.DBusername}`, { casing: 'camelCase' });

const DEBUG = process.env.NODE_ENV === 'development';

const port = process.env.port || 3000;

const app = new OpenAPIHono();

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

// main API v1
app.route('/v1', v1);

// OpenAPI endpoint
app.doc31('/doc', {
  openapi: '3.1.0',
  info: {
    version: packageInf.version,
    title: packageInf.name,
    description: packageInf.description,
  },
});

// swagger ui
app.get('/ui', swaggerUI({ url: '/doc' }));

// 404
app.notFound((c) => c.json(
  {
    error: `Route: ${c.req.url} does not exist on this server.`,
  },
  404,
));

// db setup and connect
await migrate(db, { migrationsFolder: './drizzle' });
console.debug('🛢️ Synced database successfully!');

console.debug(`🚀 API started successfully on ${port}!`);

export { DEBUG, app };

// bun specific serve exports
export default { port, fetch: app.fetch };
