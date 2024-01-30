import express from 'express';

import appsRouter from './apps';

import bridgesRouter from './bridges';

import hubsRouter from './hubs';

import usersRouter from './users';

const v1 = express.Router();

v1.use('/apps', appsRouter);

v1.use('/bridges', bridgesRouter);

v1.use('/hubs', hubsRouter);

v1.use('/users', usersRouter);

v1.get('/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Healthcheck successful',
  });
});

export default v1;
