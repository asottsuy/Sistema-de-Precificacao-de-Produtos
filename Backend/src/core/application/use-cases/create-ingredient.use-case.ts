import { Injectable } from '@nestjs/common';
import { Ingredient } from '../../domain/entities/ingredient.entity';
import { CreateIngredientDto } from '../../../presentation/dtos/create-ingredient.dto';

@Injectable()
export class CreateIngredientUseCase {
  // Nota: Para ser 100% Clean, injetaríamos um repositório aqui futuramente
  execute(dto: CreateIngredientDto): Promise<Ingredient> {
    const ingredient = new Ingredient(null, dto.name, dto.costPrice, dto.unit);

    // Aqui você adicionaria a chamada para o banco
    console.log('Ingrediente pronto para ser salvo:', ingredient);

    return Promise.resolve(ingredient);
  }
}
