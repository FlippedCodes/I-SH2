import { Hono } from 'hono';

const hubs = new Hono();

hubs
  // get: identifier; ownerId; searchString
  // not sure if broadcast command should be removed, as this would need to be pagenated.
  .get('/')
  // post: name, ownerID, ownerAppIdentifier
  .post();

hubs
  // get: lists settings and connected channels
  .get('/:hubId')
  // put: name, ownerID, ownerAppIdentifier
  .put()
  // delete
  .delete();

export default hubs;
