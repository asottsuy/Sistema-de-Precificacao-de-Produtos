import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '@core/domain/repositories/product.repository';

//use case para buscar ingrediente por ID
@Injectable()
export class GetProductUseCase {
  constructor(private readonly repository: ProductRepository) {}

  async execute(id: number) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return product;
  }
  // Dentro do seu Use Case
  async updatePrice(productId: number, newPrice: number) {
    const product = await this.repository.findById(productId);

    if (!product) {
      throw new BadRequestException(`Alerta: O produto não exite!`);
    }

    if (newPrice < product.totalCost) {
      // Aqui você pode retornar um aviso ou lançar uma exceção
      throw new BadRequestException(
        `Alerta: O preço de venda (R$${newPrice}) é inferior ao custo de produção (R$${product.totalCost.toFixed(2)})!`,
      );
    }

    product.salePrice = newPrice;
    await this.repository.save(product);
  }
}
