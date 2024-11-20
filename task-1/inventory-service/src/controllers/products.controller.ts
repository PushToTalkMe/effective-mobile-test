import { Request, Response } from 'express';
import { AppDataSource } from '../config/db';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/product.dto';
import { PRODUCT_EVENTS } from '../constants';
import { sendToQueue } from '../services/rabbitmq';
import { ProductActionMessage } from '../services/interfaces';

export async function createProduct(req: Request, res: Response) {
  const { plu, name }: CreateProductDto = req.body;

  try {
    const product = await AppDataSource.getRepository(Product).save({
      plu,
      name,
    });

    const productActionMessage: ProductActionMessage = {
      product_id: product.id,
      product_plu: product.plu,
      product_name: product.name,
      action: 'create_product',
    };

    await sendToQueue(PRODUCT_EVENTS, productActionMessage);

    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getProductsByFilters(req: Request, res: Response) {
  const { name, plu } = req.query;

  let query =
    AppDataSource.getRepository(Product).createQueryBuilder('product');

  if (name) {
    query = query.andWhere('product.name LIKE :name', { name: `%${name}%` });
  }
  if (plu) {
    query = query.andWhere('product.plu LIKE :plu', { plu: `%${plu}%` });
  }

  try {
    const products = await query.getMany();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}
