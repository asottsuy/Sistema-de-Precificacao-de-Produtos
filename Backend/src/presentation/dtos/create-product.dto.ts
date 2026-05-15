import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductItemDto {
  @IsNumber()
  ingredientId!: number;

  @IsNumber()
  quantity!: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description!: string;

  // 1. ADICIONE O CAMPO DE PREÇO DE VENDA AQUI
  @IsNumber()
  @IsPositive()
  salePrice!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  items!: ProductItemDto[];
}
