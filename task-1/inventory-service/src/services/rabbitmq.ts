import amqp, { Channel, Connection } from 'amqplib';
import { RABBITMQ_URL } from '../config/rabbitmq';
import {
  InventoryActionMessage,
  ProductActionMessage,
  ShopActionMessage,
} from './interfaces';
import { INVENTORY_EVENTS, PRODUCT_EVENTS, SHOP_EVENTS } from '../constants';

export async function sendToQueue(
  queue: typeof PRODUCT_EVENTS | typeof SHOP_EVENTS | typeof INVENTORY_EVENTS,
  message: ProductActionMessage | ShopActionMessage | InventoryActionMessage,
): Promise<void> {
  try {
    const connection: Connection = await amqp.connect(RABBITMQ_URL);
    const channel: Channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log('Сообщение отправлено и находится в очереди:', queue);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Ошибка при отправке сообщения на RabbitMQ:', error);
  }
}
