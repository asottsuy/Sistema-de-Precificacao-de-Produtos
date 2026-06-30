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

  async save(ingredient: Ingredient): Promise<Ingredient> {
    const schema = this.repository.create(ingredient);
    const savedSchema = await this.repository.save(schema);

    return new Ingredient(
      savedSchema.id,
      savedSchema.name,
      savedSchema.costPrice,
      savedSchema.unit,
      savedSchema.packageSize,
    );
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
      ingredientSchema.packageSize,
    );
  }

  async findAll(): Promise<Ingredient[]> {
    const schemas = await this.repository.find();

    return schemas.map(
      (schema) =>
        new Ingredient(
          schema.id,
          schema.name,
          schema.costPrice,
          schema.unit,
          schema.packageSize,
        ),
    );
  }

  async findById(id: number): Promise<Ingredient | null> {
    console.log('ingrediente foi buscado!!');
    const schema = await this.repository.findOneBy({ id });
    if (!schema) return null;

    return new Ingredient(
      schema.id,
      schema.name,
      schema.costPrice,
      schema.unit,
      schema.packageSize,
    );
  }

  async deleteById(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
