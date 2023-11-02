import * as dotenv from 'dotenv';
dotenv.config();
// init rabbitmq connection handler
import { connect } from 'amqplib';
// init Discord
import { Client, IntentsBitField } from 'discord.js';
// use contructor to create intent bit field
const intents = new IntentsBitField([
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.MessageContent,
]);

const mqConnection = await connect('amqp://localhost');
const incomingMQ = await mqConnection.createChannel();
const queueincoming = 'incoming:sentMessage';
await incomingMQ.assertQueue(queueincoming, { durable: false });
const outgoingMQ = await mqConnection.createChannel();
const queueOutgoing = 'discord';
await outgoingMQ.assertQueue(queueOutgoing, { durable: false });

// setting essential global values
// init Discord client
global.client = new Client({ disableEveryone: true, intents });

// init config
// global.config = require('./config.json');
global.config = {};

import packageDetails from './package.json' assert { type: "json" };
global.config.package = packageDetails;

global.DEBUG = process.env.NODE_ENV === 'development';

await client.login(process.env.discordToken);

client.on('ready', async () => {
  // confirm user logged in
  console.log(`[${config.package.name}] Logged in as "${client.user.tag}"!`);
});

client.on('messageCreate', (message) => {
  if (message.content === '') return;
  const payload = {
    type: 'create',
    service: 'telegram',
    content: message.content,
    channelID: message.channel.id,
  }
  incomingMQ.sendToQueue(queueIncoming, Buffer.from(JSON.stringify(payload)));
});

client.on('interactionCreate', (interaction) => {
  
});

outgoingMQ.consume(queueOutgoing, async (msg) => {
  // get payload, channel and webhook to post message
  const payload = msg.content.toJSON();
  const channelID = payload.channelID;
  const channel = await client.channels.fetch(channelID);
  if (!channel) return console.warn(`Unable to find ${channelID}.`);
  const channelWebhooks = await channel.fetchWebhooks();
  let hook = channelWebhooks.find((hook) => hook.owner.id === client.user.id);
  if (!hook) hook = await channel.createWebhook({ name: config.name }).catch(ERR);
  const sentMessage = await hook.send({
    // content: payload.content, components: [predoneButtons], username, avatarURL, files,
    content: payload.content,
  }).catch(ERR);
  // acknowledge message
  msgQ.ack(msg);
});
