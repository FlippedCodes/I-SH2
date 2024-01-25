import express from 'express';

import routertest from './test';

const router = express.Router();

router.use('/test', routertest);

router.get('/healthcheck', (req, res) => {
  // TODO: write function to check if all services are still available
  res.status(200).json({
    status: 'success',
    message: 'Healthcheck successful',
  });
});

export default router;

// router
//   .route('URI')
//   .use()
//   .get(http_get_FUNCTION)
//   .post(http_post_FUNCTION);
