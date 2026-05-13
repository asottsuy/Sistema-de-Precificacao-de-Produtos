import { Injectable, NotFoundException } from '@nestjs/common';
import { Ingredient } from '../../domain/entities/ingredient.entity';
import { IngredientRepository } from '@core/domain/repositories/ingredient.repository';
import { UpdateIngredientDto } from '@presentation/dtos/create-ingredient.dto';

@Injectable()
export class UpdateIngredientUseCase {
  constructor(private readonly repository: IngredientRepository) {}

  async execute(id: number, dto: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.repository.findById(id);

    if (!ingredient) {
      throw new NotFoundException(
        'Ingrediente não encontrado para atualização.',
      );
    }

    // Criamos uma nova instância com os dados atualizados (Imutabilidade)
    const updatedIngredient = new Ingredient(
      id,
      dto.name ?? ingredient.name,
      dto.costPrice ?? ingredient.costPrice,
      dto.unit ?? ingredient.unit,
      dto.packageSize ?? ingredient.packageSize,
    );

    return this.repository.save(updatedIngredient);
  }
}
