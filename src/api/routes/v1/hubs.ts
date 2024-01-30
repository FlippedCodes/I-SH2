import express from 'express';

const hubs = express.Router();

hubs
  .route('/')
  // get: identifier; ownerId; searchString
  // not sure if broadcast command should be removed, as this would need to be pagenated.
  .get()
  // post: name, ownerID, ownerAppIdentifier
  .post();

hubs
  .route('/:hubId')
  // get: lists settings and connected channels
  .get()
  // put: name, ownerID, ownerAppIdentifier
  .put()
  // delete
  .delete();

export default hubs;
