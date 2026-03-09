import { OpenAPIHono } from '@hono/zod-openapi';

import { errorHandler } from 'hono-error-handler';

import { StatusCode } from 'hono/utils/http-status';

import appsRouter from './apps';

import bridgesRouter from './bridges';

import hubsRouter from './hubs';

import usersRouter from './users';

const v1 = new OpenAPIHono();

// TODO: fix code and finally populate

v1.route('/apps', appsRouter);

v1.route('/bridges', bridgesRouter);

v1.route('/hubs', hubsRouter);

v1.route('/users', usersRouter);

v1.get('/healthcheck', (c) => c.json({
  status: 'success',
  message: 'Healthcheck successful',
}));

// https://www.npmjs.com/package/hono-error-handler
v1.onError(errorHandler([], (err, c) => {
  console.error(`${err.stack}`);
  let stack;
  if (err.statusCode === 404) stack = err.stack;
  return c.json({ success: false, error: { message: err.message || 'Internal server error', stack } }, err.statusCode as StatusCode || 500);
}));

export default v1;
