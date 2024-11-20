import { DataSource } from 'typeorm';
import { Shop } from '../entities/shop.entity';
import { Product } from '../entities/product.entity';
import { Inventory } from '../entities/inventory.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'inventory',
  synchronize: true,
  logging: true,
  entities: [Shop, Product, Inventory],
  subscribers: [],
  migrations: [],
});
