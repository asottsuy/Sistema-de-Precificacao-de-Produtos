import { CreateProductUseCase } from '@core/application/use-cases/create-product.use-case';
import { ProductRepository } from '@core/domain/repositories/product.repository';
import { TypeOrmProductRepository } from '@infra/database/typeorm/repositories/typeorm-product.repository';
import {
  ProductItemSchema,
  ProductSchema,
} from '@infra/database/typeorm/entities/product.schema';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from '@presentation/controllers/products.controller';
import { IngredientsNestModule } from './ingredients.nest-module';
import { GetProductUseCase } from '@core/application/use-cases/get-products.use-case';
import { DeleteProductUseCase } from '@core/application/use-cases/delete-product.use-case';
import { GetAllProductsUseCase } from '@core/application/use-cases/list-products.use-case';

@Module({
  imports: [
    // Registra a entidade (Schema) para o TypeORM saber que a tabela existe
    TypeOrmModule.forFeature([ProductSchema, ProductItemSchema]),
    IngredientsNestModule,
  ],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    GetProductUseCase,
    DeleteProductUseCase,
    GetAllProductsUseCase,

    { provide: ProductRepository, useClass: TypeOrmProductRepository },
  ],
})
export class ProductsNestModule {}
