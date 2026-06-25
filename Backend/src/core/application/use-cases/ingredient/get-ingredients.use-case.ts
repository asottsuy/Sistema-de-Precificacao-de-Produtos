import { Injectable, NotFoundException } from '@nestjs/common';
import { IngredientRepository } from '@core/domain/repositories/ingredient.repository';

//use case para buscar ingrediente por ID
@Injectable()
export class GetIngredientUseCase {
  constructor(private readonly repository: IngredientRepository) {}

  async execute(id: number) {
    const ingredient = await this.repository.findById(id);

    if (!ingredient) {
      throw new NotFoundException('Ingrediente não encontrado.');
    }

    return ingredient;
  }
}
