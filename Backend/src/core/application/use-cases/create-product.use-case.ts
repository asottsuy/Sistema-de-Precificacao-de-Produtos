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

      // REGRA DE NEGÓCIO DO RELATÓRIO: Calcula o custo por unidade base (ex: preço por grama ou ml)
      // Se o café custa R$ 38.00 e a embalagem tem 250g, o custo por unidade base será R$ 0.152
      // 🔥 PASSO A PASSO DA ENGENHARIA FINANCEIRA:

      // 1. Descobre o custo da unidade base (ex: Preço por grama ou por litro)
      const costPerUnitBase = ingredient.costPrice / ingredient.packageSize;

      // 2. Multiplica o custo unitário pela quantidade REAL que vai na receita
      // Ex Leite: (6.80 / 1) * 0.15 = R$ 1.02
      // Ex Açúcar: (5.50 / 1) * 0.003 = R$ 0.0165
      const totalItemCost = costPerUnitBase * item.quantity;

      // 3. Arredonda para evitar problemas de dízimas periódicas do JavaScript (ex: 3 casas decimais)
      const finalItemCost = parseFloat(totalItemCost.toFixed(3));

      // Criamos o item da ficha técnica com o preço unitário proporcional correto
      productItems.push(
        new ProductItem(
          ingredient.id!,
          item.quantity,
          finalItemCost, // <-- Passamos o custo fracionado em vez do preço cheio da embalagem
        ),
      );
    }

    // 2. Criar a Entidade de Domínio Product
    const product = new Product(
      null,
      dto.name,
      dto.description,
      productItems,
      dto.salePrice,
    );

    console.log(
      '🟢 [Use Case] Produto criado com custo proporcional correto:',
      product,
    );

    // 3. Persistir no banco através do repositório
    return this.productRepository.save(product);
  }
}
