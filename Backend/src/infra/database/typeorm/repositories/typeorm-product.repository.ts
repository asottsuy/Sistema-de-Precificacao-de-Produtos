import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '@core/domain/repositories/product.repository';
import { Product } from '@core/domain/entities/product.entity';
import { ProductSchema, ProductItemSchema } from '../entities/product.schema';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly repository: Repository<ProductSchema>,
  ) {}

  async save(product: Product): Promise<Product> {
    const schema = this.repository.create({
      id: product.id || undefined,
      name: product.name,
      description: product.description,
      items: product.items.map((item) => ({
        // 1. A relação: apontamos para o ID do ingrediente
        ingredient: { id: item.ingredientId },

        // 2. Os valores: devem estar no primeiro nível do objeto do item
        quantity: item.quantity,
        pricePerUnit: Number(item.ingredientCostPrice),
      })),
    });

    const savedSchema = await this.repository.save(schema);

    // Reconstruímos a entidade de domínio para garantir que o ID do banco volte
    return new Product(
      savedSchema.id,
      savedSchema.name,
      savedSchema.description,
      product.items,
    );
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.repository.findOne({
      where: { id },
      relations: ['items', 'items.ingredient'], // Carrega a ficha técnica e os dados do ingrediente
    });

    if (!product) return null;

    // Aqui você faria o mapeamento inverso (Schema -> Entidade)
    return null; // Implementar mapeamento
  }

  async findAll(): Promise<Product[]> {
    return []; // Implementar listagem
  }
}
