// core/application/use-cases/delete-product.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '@core/domain/repositories/product.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado para exclusão');
    }
    console.log('product: ', product);
    await this.productRepository.delete(id);
  }
}
