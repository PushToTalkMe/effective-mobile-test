import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  plu!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;
}

export class ProductDto {
  @IsNumber()
  id!: number;

  @IsString()
  plu!: string;

  @IsString()
  name!: string;
}
