import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
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

  @IsNumber()
  salePrice!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  items!: ProductItemDto[];
}
