import { Injectable } from '@nestjs/common';
import { Ingredient } from '../../domain/entities/ingredient.entity';
import { IngredientRepository } from '@core/domain/repositories/ingredient.repository';

@Injectable()
export class ListIngredientsUseCase {
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async execute(): Promise<Ingredient[]> {
    return this.ingredientRepository.findAll();
  }
}
