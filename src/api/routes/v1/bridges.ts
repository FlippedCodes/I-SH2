import { Hono } from 'hono';

const bridges = new Hono();

bridges
  .route('/')
  // create: channelID, { addintionalChannelData }, hubID, appIdentifier, allowInvites
  .post();

// eslint-disable-next-line drizzle/enforce-delete-with-where
bridges
  // get: list of bidges/channels
  .get('/:hubId')
  // update: channelID, { addintionalChannelData }, hubID, appIdentifier, allowInvites
  .put()
  .delete((c) => c.text('DELETE /endpoint'));

export default bridges;
