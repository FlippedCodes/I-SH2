import express from 'express';

const bridges = express.Router();

bridges
  .route('/')
  // create: channelID, { addintionalChannelData }, hubID, appIdentifier, allowInvites
  .post();

bridges
  .route('/:hubId')
  // get: list of bidges/channels
  .get()
  // update: channelID, { addintionalChannelData }, hubID, appIdentifier, allowInvites
  .put()
  
  .delete();

export default bridges;
