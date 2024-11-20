import { Request, Response } from 'express';
import { AppDataSource } from '../config/db';
import { Shop } from '../entities/shop.entity';
import { CreateShopDto } from '../dto/shop.dto';
import { SHOP_EVENTS } from '../constants';
import { sendToQueue } from '../services/rabbitmq';
import { ShopActionMessage } from '../services/interfaces';

export async function createShop(req: Request, res: Response) {
  const { name }: CreateShopDto = req.body;

  try {
    const shop = await AppDataSource.getRepository(Shop).save({
      name,
    });

    const shopActionMessage: ShopActionMessage = {
      shop_id: shop.id,
      shop_name: shop.name,
      action: 'create_shop',
    };

    await sendToQueue(SHOP_EVENTS, shopActionMessage);
    res.status(201).json(shop);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
