import { ProductRepository } from '@core/domain/repositories/product.repository';
import { IngredientRepository } from '@core/domain/repositories/ingredient.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Product, ProductItem } from '@core/domain/entities/product.entity';
import { CreateProductDto } from '@presentation/dtos/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly ingredientRepository: IngredientRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    const productItems: ProductItem[] = [];
    console.log('dto: ', dto);

    // 1. Validar e buscar cada ingrediente da lista
    for (const item of dto.items) {
      const ingredient = await this.ingredientRepository.findById(
        item.ingredientId,
      );

      if (!ingredient) {
        throw new NotFoundException(
          `Ingrediente com ID ${item.ingredientId} não encontrado.`,
        );
      }

      // Criamos o item da ficha técnica com o preço de custo atual do ingrediente
      productItems.push(
        new ProductItem(ingredient.id!, item.quantity, ingredient.costPrice),
      );
    }

    // 2. Criar a Entidade de Domínio Product
    const product = new Product(null, dto.name, dto.description, productItems);

    console.log('produto criado: ', product);
    // 3. Persistir no banco através do repositório
    return this.productRepository.save(product);
  }
}
