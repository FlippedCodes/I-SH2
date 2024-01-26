import express from 'express';

import appsRouter from './apps';

import bridgesRouter from './bridges';

import hubsRouter from './hubs';

import usersRouter from './users';

const router = express.Router();

router.use('/apps', appsRouter);

router.use('/bridges', bridgesRouter);

router.use('/hubs', hubsRouter);

router.use('/users', usersRouter);

router.get('/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Healthcheck successful',
  });
});

export default router;
