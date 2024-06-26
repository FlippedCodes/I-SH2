import { Hono } from 'hono';

const users = new Hono();

const blocks = new Hono();

const tosAgrees = new Hono();

users.use('/blocks', blocks);

users.use('/tosAgrees', tosAgrees);

blocks
  .route('/:hubId')
  // create: { appIdenticator, chanenlID, userID, reason }
  .post();

blocks
  .route('/:hubId')
  // get: list of blocks in a hubid; optional uri args are userid and appidentifier (only together)
  .get()
  // delete: block ID
  .delete();

tosAgrees
  .route('/:userId')
  // create: { userId, AppIndicator }
  .put();

tosAgrees
  .route('/:userId')
  // get: a list of all the service ToS the user Agreed to
  .get()
  // create: { userId, AppIndicator }
  .put()
  // delete: { userId, AppIndicator }
  .delete();

export default users;
