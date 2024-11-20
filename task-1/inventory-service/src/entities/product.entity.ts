import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  plu!: string;

  @Column({ length: 255 })
  name!: string;

  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventories!: Inventory[];
}
