import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stock_quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  order_quantity!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  shop_id!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  product_id!: number;
}

export class UpdateInventoryDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  inventory_id!: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  stock_change!: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @Min(0)
  order_change!: number;
}

export class InventoryDto {
  @IsNumber()
  id!: number;

  @IsNumber()
  stock_quantity!: number;

  @IsNumber()
  order_quantity!: number;

  @IsNumber()
  shop_id!: number;

  @IsNumber()
  product_id!: number;
}
