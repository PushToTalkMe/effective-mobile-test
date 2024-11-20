import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}

export class ShopDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;
}
