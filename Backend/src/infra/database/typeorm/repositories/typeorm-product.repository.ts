import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '@core/domain/repositories/product.repository';
import { Product, ProductItem } from '@core/domain/entities/product.entity';
import { ProductSchema } from '../entities/product.schema';

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
      salePrice: product.salePrice ?? 0,
      items: product.items.map((item) => ({
        ingredient: { id: item.ingredientId },
        quantity: item.quantity,
        pricePerUnit: Number(item.ingredientCostPrice),
      })),
    });

    const savedSchema = await this.repository.save(schema);

    return new Product(
      savedSchema.id,
      savedSchema.name,
      savedSchema.description,
      product.items,
      Number(savedSchema.salePrice),
    );
  }

  async findById(id: number): Promise<Product | null> {
    const productSchema = await this.repository.findOne({
      where: { id },
      relations: ['items', 'items.ingredient'],
    });

    if (!productSchema) return null;

    const domainItems = productSchema.items.map((item) => {
      return new ProductItem(
        item.ingredient.id!,
        Number(item.quantity),
        Number(item.pricePerUnit),
      );
    });

    // CORRIGIDO: Agora o preço mapeado do banco é passado corretamente
    return new Product(
      productSchema.id,
      productSchema.name,
      productSchema.description,
      domainItems,
      Number(productSchema.salePrice || 0),
    );
  }

  async findAll(): Promise<Product[]> {
    const schemas = await this.repository.find({
      relations: ['items', 'items.ingredient'], // Traz as relações para o cálculo de CMV funcionar na listagem
    });

    return schemas.map((schema) => {
      const domainItems =
        schema.items?.map((item) => {
          return new ProductItem(
            item.ingredient.id!,
            Number(item.quantity),
            Number(item.pricePerUnit),
          );
        }) || [];

      return new Product(
        schema.id,
        schema.name,
        schema.description,
        domainItems,
        Number(schema.salePrice || 0),
      );
    });
  }

  async delete(id: number): Promise<void> {
    console.log('caiu no delete', id);
    await this.repository.softDelete(id);
  }
}
