import { connect } from 'amqplib';

const connection = await connect('amqp://localhost');

const msgQ = await connection.createChannel();

const messageQueueName = 'incomming:sentMessage';

await msgQ.assertQueue(messageQueueName, { durable: false });

msgQ.consume(messageQueueName, (msg) => {
  // check app --> use later for queue name
  console.log(msg.content.toString());
  msgQ.ack(msg);
});
