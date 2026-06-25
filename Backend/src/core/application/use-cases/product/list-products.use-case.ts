// core/application/use-cases/get-all-products.use-case.ts
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@core/domain/repositories/product.repository';
import { Product } from '@core/domain/entities/product.entity';

@Injectable()
export class GetAllProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
