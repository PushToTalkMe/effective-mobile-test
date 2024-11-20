import { Request, Response } from 'express';
import { AppDataSource } from '../config/db';
import { Product } from '../entities/product.entity';
import { Inventory } from '../entities/inventory.entity';
import { Shop } from '../entities/shop.entity';
import { CreateInventoryDto, UpdateInventoryDto } from '../dto/inventory.dto';
import {
  ERROR_SHOP_NOT_FOUND,
  ERROR_PRODUCT_NOT_FOUND,
  ERROR_INVENTORY_NOT_FOUND,
  SUCCESS_INCREASE_INVENTORY,
  ERROR_INCREASE_INVENTORY,
  ERROR_STOCK_NEGATIVE,
  ERROR_ORDER_NEGATIVE,
  SUCCESS_DECREASE_INVENTORY,
  ERROR_DECREASE_INVENTORY,
  ERROR_INVENTORY_EXISTS,
  INVENTORY_EVENTS,
} from '../constants';
import { sendToQueue } from '../services/rabbitmq';
import { InventoryActionMessage } from '../services/interfaces';

export async function createInventory(req: Request, res: Response) {
  const {
    stock_quantity,
    order_quantity,
    shop_id,
    product_id,
  }: CreateInventoryDto = req.body;

  try {
    const shop = await AppDataSource.getRepository(Shop).findOne({
      where: { id: shop_id },
    });
    if (!shop) {
      res.status(404).json({ message: ERROR_SHOP_NOT_FOUND });
      return;
    }

    const product = await AppDataSource.getRepository(Product).findOne({
      where: { id: product_id },
    });
    if (!product) {
      res.status(404).json({ message: ERROR_PRODUCT_NOT_FOUND });
      return;
    }

    const inventory = await AppDataSource.getRepository(Inventory)
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.shop', 'shop')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('shop.id = :shop_id', { shop_id })
      .andWhere('product.id = :product_id', { product_id })
      .getOne();

    if (inventory) {
      res.status(400).json({ message: ERROR_INVENTORY_EXISTS });
      return;
    }

    const newInventory = await AppDataSource.getRepository(Inventory).save({
      stock_quantity,
      order_quantity,
      shop,
      product,
    });

    const inventoryActionMessage: InventoryActionMessage = {
      inventory_id: newInventory.id,
      product_plu: product.plu,
      shop_id: shop.id,
      product_id: product.id,
      stock_quantity: newInventory.stock_quantity,
      order_quantity: newInventory.order_quantity,
      action: 'create_inventory',
    };

    await sendToQueue(INVENTORY_EVENTS, inventoryActionMessage);

    res.status(201).json(newInventory);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function getInventoryByFilters(req: Request, res: Response) {
  const { plu, shop_id, stockMin, stockMax, orderMin, orderMax } = req.query;

  try {
    let query = AppDataSource.getRepository(Inventory)
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.shop', 'shop')
      .leftJoinAndSelect('inventory.product', 'product');

    if (plu) {
      query.andWhere('product.plu LIKE :plu', { plu: `%${plu}%` });
    }
    if (shop_id) {
      query.andWhere('shop.id = :shop_id', { shop_id });
    }
    if (stockMin) {
      query.andWhere('inventory.stock_quantity >= :stockMin', { stockMin });
    }
    if (stockMax) {
      query.andWhere('inventory.stock_quantity <= :stockMax', { stockMax });
    }
    if (orderMin) {
      query.andWhere('inventory.order_quantity >= :orderMin', { orderMin });
    }
    if (orderMax) {
      query.andWhere('inventory.order_quantity <= :orderMax', { orderMax });
    }

    const inventory = await query.getMany();
    res.status(200).json(inventory);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export const increaseInventory = async (req: Request, res: Response) => {
  const { inventory_id, stock_change, order_change }: UpdateInventoryDto =
    req.body;

  try {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const inventory = await AppDataSource.getRepository(Inventory)
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.shop', 'shop')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('inventory.id = :inventory_id', { inventory_id })
      .getOne();

    if (!inventory) {
      res.status(404).json({ message: ERROR_INVENTORY_NOT_FOUND });
      return;
    }

    if (stock_change !== undefined) {
      inventory.stock_quantity += stock_change;
    }

    if (order_change !== undefined) {
      inventory.order_quantity += order_change;
    }

    await inventoryRepository.save(inventory);

    const inventoryActionMessage: InventoryActionMessage = {
      inventory_id: inventory.id,
      shop_id: inventory.shop.id,
      product_id: inventory.product.id,
      product_plu: inventory.product.plu,
      stock_quantity: inventory.stock_quantity,
      order_quantity: inventory.order_quantity,
      action: 'increase_inventory',
    };

    await sendToQueue(INVENTORY_EVENTS, inventoryActionMessage);

    res.status(200).json({ message: SUCCESS_INCREASE_INVENTORY, inventory });
  } catch (error) {
    res.status(400).json({ message: ERROR_INCREASE_INVENTORY, error });
  }
};

export const decreaseInventory = async (req: Request, res: Response) => {
  const { inventory_id, stock_change, order_change }: UpdateInventoryDto =
    req.body;

  try {
    const inventoryRepository = AppDataSource.getRepository(Inventory);
    const inventory = await AppDataSource.getRepository(Inventory)
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.shop', 'shop')
      .leftJoinAndSelect('inventory.product', 'product')
      .where('inventory.id = :inventory_id', { inventory_id })
      .getOne();

    if (!inventory) {
      res.status(404).json({ message: ERROR_INVENTORY_NOT_FOUND });
      return;
    }

    if (stock_change !== undefined) {
      inventory.stock_quantity -= stock_change;
      if (inventory.stock_quantity < 0) {
        res.status(400).json({ message: ERROR_STOCK_NEGATIVE });
        return;
      }
    }

    if (order_change !== undefined) {
      inventory.order_quantity -= order_change;
      if (inventory.order_quantity < 0) {
        res.status(400).json({ message: ERROR_ORDER_NEGATIVE });
        return;
      }
    }

    await inventoryRepository.save(inventory);

    const inventoryActionMessage: InventoryActionMessage = {
      inventory_id: inventory.id,
      shop_id: inventory.shop.id,
      product_id: inventory.product.id,
      product_plu: inventory.product.plu,
      stock_quantity: inventory.stock_quantity,
      order_quantity: inventory.order_quantity,
      action: 'decrease_inventory',
    };

    await sendToQueue(INVENTORY_EVENTS, inventoryActionMessage);

    res.status(200).json({ message: SUCCESS_DECREASE_INVENTORY, inventory });
  } catch (error) {
    res.status(400).json({ message: ERROR_DECREASE_INVENTORY, error });
  }
};
