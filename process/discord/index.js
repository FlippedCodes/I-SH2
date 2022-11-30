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
const incommingMQ = await mqConnection.createChannel();
const queueName = 'incomming:sentMessage';
await incommingMQ.assertQueue(queueName, { durable: false });

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
  // client.functions.get('EVENT_messageCreate').run(message).catch(ERR);
  incommingMQ.sendToQueue(queueName, Buffer.from(message.content));
});

client.on('interactionCreate', (interaction) => {

});
