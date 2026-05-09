import { Injectable, NotFoundException } from '@nestjs/common';
import { IngredientRepository } from '@core/domain/repositories/ingredient.repository';

@Injectable()
export class DeleteIngredientUseCase {
  constructor(private readonly repository: IngredientRepository) {}

  async execute(id: number) {
    const ingredient = await this.repository.findById(id);

    if (!ingredient) {
      throw new NotFoundException('Ingrediente não encontrado para remoção.');
    }

    await this.repository.deleteById(id);
  }
}
