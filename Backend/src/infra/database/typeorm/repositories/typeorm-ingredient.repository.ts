// src/infra/database/typeorm/repositories/typeorm-ingredient.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '@core/domain/entities/ingredient.entity';
import { IngredientRepository } from '@core/domain/repositories/ingredient.repository';
import { IngredientSchema } from '../entities/ingredient.schema';

@Injectable()
export class TypeOrmIngredientRepository implements IngredientRepository {
  constructor(
    @InjectRepository(IngredientSchema)
    private readonly repository: Repository<IngredientSchema>,
  ) {}

  async save(ingredient: Ingredient): Promise<void> {
    // Mapeamos a Entidade de Domínio para o Schema do TypeORM
    const schema = this.repository.create({
      id: ingredient.id ?? undefined,
      name: ingredient.name,
      costPrice: ingredient.costPrice,
      unit: ingredient.unit,
    });

    await this.repository.save(schema);
  }

  async findByName(name: string): Promise<Ingredient | null> {
    const ingredientSchema = await this.repository.findOne({
      where: { name: name },
    });

    if (!ingredientSchema) {
      //se o nome não existir
      return null;
    }

    return new Ingredient(
      ingredientSchema.id,
      ingredientSchema.name,
      ingredientSchema.costPrice,
      ingredientSchema.unit,
    );
  }
}
