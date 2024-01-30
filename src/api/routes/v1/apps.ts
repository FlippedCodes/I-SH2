import express from 'express';

const apps = express.Router();

apps
  .route('/')
  .get()
  .post();

apps
  .route('/:identifier')
  .get()
  .delete();

export default apps;

// {
//   "id": 0,
//   "name": "APPNAME",
//   "features": {
//     "featureX": true,
//     "featureY": 0
//   }
// }
