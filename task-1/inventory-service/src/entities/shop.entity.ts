import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @OneToMany(() => Inventory, (inventory) => inventory.shop)
  inventories!: Inventory[];
}
