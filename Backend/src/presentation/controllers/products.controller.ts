import {
  Controller,
  Param,
  Post,
  Body,
  UsePipes,
  Get,
  ParseIntPipe,
  Delete,
  HttpCode,
  Patch,
} from '@nestjs/common';
//use cases
import { CreateProductUseCase } from '@core/application/use-cases/create-product.use-case';
//dtos
import { CreateProductDto } from '@presentation/dtos/create-product.dto';
import { Product } from '../../core/domain/entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    console.log('passei no controller e o param e esse: ', createProductDto);
    return this.createProductUseCase.execute(createProductDto);
  }
}
