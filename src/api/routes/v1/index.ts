import { Hono } from 'hono';

import appsRouter from './apps';

import bridgesRouter from './bridges';

import hubsRouter from './hubs';

import usersRouter from './users';

const v1 = new Hono();

// TODO: fix code and finally populate

v1.route('/apps', appsRouter);

v1.route('/bridges', bridgesRouter);

v1.route('/hubs', hubsRouter);

v1.route('/users', usersRouter);

v1.get('/healthcheck', (c) => c.json({
  status: 'success',
  message: 'Healthcheck successful',
}));

export default v1;
