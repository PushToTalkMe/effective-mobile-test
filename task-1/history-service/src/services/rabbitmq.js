import amqp from 'amqplib';
import { RABBITMQ_URL } from '../config/rabbitmq.js';
import { AppDataSource } from '../config/db.js';
import { ActionLogs } from '../entities/action-logs.entity.js';

export async function connectToRabbitMQ() {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queues = ['product_events', 'shop_events', 'inventory_events'];

  queues.forEach((queue) => {
    channel.assertQueue(queue, { durable: true });
    console.log(`Ожидание сообщения в очереди: ${queue}`);
    channel.consume(queue, async (msg) => {
      if (msg) {
        const message = JSON.parse(msg.content.toString());
        console.log(
          `Принято новое сообщение из очереди ${queue}:`,
          message.action,
        );
        await AppDataSource.getRepository(ActionLogs).save(message);
        channel.ack(msg);
      }
    });
  });
}
