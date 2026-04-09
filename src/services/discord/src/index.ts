import { ShardingManager, Constants } from 'discord.js';

import { Connection, ConsumerStatus } from 'rabbitmq-client';

const log = (logger: Console['debug' | 'info' | 'error'], ...args: any[]) =>
  logger('[SHARD MGR]', ...args);

//#region Init
// discord manager
const manager = new ShardingManager('./src/bot.ts', { token: process.env.DCtoken });

// rabbitmq
const rabbit = new Connection(`amqp://${process.env.MBusername}:${process.env.MBpassword}@${process.env.MBhost}:${parseInt(<string>process.env.MBport, 10) || 5672}`);
rabbit.on('error', (err) => log(console.warn, '🐇⚠️ RabbitMQ connection error:', err));
rabbit.on('connection', () => log(console.info, '🐇✅ Connection successfully (re)established!'));

//#region Register App
const body = {
  name: 'discord',
  features: {
    tosLink: 'https://discord.com/terms',
    privacyPolicyLink: 'https://discord.com/privacy',
    textLength: 2000,
    trackMessage: true,
    deleteMessage: true,
    deleteMessageTime: Constants.MaxBulkDeletableMessageAge,
    inviteLinks: true,
    webhookSupport: true,
    media: true,
    mediaStickers: true,
    mediaEmojis: true,
  },
};

const apiResponse = await fetch(`${process.env.apiEndpoint}/v1/apps`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
if (!apiResponse.ok)
  throw new Error(`⚠️ Unable to register the App with the API: ${apiResponse.statusText}`);

const response = await apiResponse.json();
switch (apiResponse.status) {
  case 201:
    log(console.info, `✅ Successfully registered App with API! AppID: ${response.id}`);
    break;
  case 200:
    log(console.info, `✅ Successfully updated existing App in API! AppID: ${response.id}`);
    break;
  default:
    throw new Error(`⚠️ Unknown return code: ${response}`);
}

//#region Spawn shards and setup queue
manager.on('shardCreate', (shard) => log(console.info, `Launched shard ${shard.id}`));

rabbit.createConsumer({
    queue: 'service_discord',
    queueOptions: { durable: false },
    // qos: {prefetchCount: 2}, // handle 2 messages at a time
  }, async (msg) => {
    let payload;
    try {
      payload = JSON.parse(msg.body.toString());
    } catch {
      log(console.error, 'MB Payload is not in a JSON format.')
      return ConsumerStatus.DROP;
    }
    console.log(payload);
    const data = {

    }
    // shard.send({ type: 'sendMessage', data });
    return ConsumerStatus.ACK;
  })

manager.spawn();

//#region Delaunch App
async function cleanExit() {
  const apiResponse = await fetch(`${process.env.apiEndpoint}/v1/apps/discord`, { method: 'DELETE' });
  
  // Workaround: bun process doesn't seem to exit, when shard manager exists
  manager.respawn = false;
  manager.shards.forEach((shard) => shard.kill());
  
  if (!apiResponse.ok) process.exit(1);
  // FIXME: Logs don't show up in logs
  // if (!apiResponse.ok) throw new Error(`⚠️ Unable to mark app as delaunched: ${apiResponse.statusText}`);
  // log(console.info, `✅ Successfully delaunched app with API!`);
  // setTimeout(() => process.exit(0), 500).unref();
  process.exit(0);
}
process.on('SIGTERM', () => cleanExit());
process.on('SIGINT', () => cleanExit());
