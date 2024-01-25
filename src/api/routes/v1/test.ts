import express from 'express';

const router = express.Router();

router.get('/healthcheck', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Healthcheck successful',
  });
});

export default router;
