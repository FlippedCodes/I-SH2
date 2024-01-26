import express from 'express';

const router = express.Router();

router
  .route('/')
  .get()
  .post();

router
  .route('/:identifier')
  .get()
  .delete();

export default router;
