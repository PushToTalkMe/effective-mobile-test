import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shop } from './shop.entity';
import { Product } from './product.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  stock_quantity!: number;

  @Column()
  order_quantity!: number;

  @ManyToOne(() => Shop, (shop) => shop.inventories, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shop_id' })
  shop!: Shop;

  @ManyToOne(() => Product, (product) => product.inventories, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;
}
