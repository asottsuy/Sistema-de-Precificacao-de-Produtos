import { ConflictException, Injectable } from '@nestjs/common';
import { Ingredient } from '../../../domain/entities/ingredient.entity';
import { CreateIngredientDto } from '../../../../presentation/dtos/create-ingredient.dto';
import { IngredientRepository } from '@core/domain/repositories/ingredient.repository';

@Injectable()
export class CreateIngredientUseCase {
  // Agora o Use Case tem uma ferramenta para falar com o mundo externo
  constructor(private readonly ingredientRepository: IngredientRepository) {}

  async execute(dto: CreateIngredientDto): Promise<Ingredient> {
    // 1. Criamos a entidade de domínio (Regra de Negócio)
    // vamos validar se o ingrediente já existe
    const alreadyExists = await this.ingredientRepository.findByName(
      dto.name, //chama a abstração de findbyname
    );
    if (alreadyExists) {
      //lança o erro se existir
      throw new ConflictException('Esse ingrediente já existe!');
    }
    const ingredient = new Ingredient(
      null,
      dto.name,
      dto.costPrice,
      dto.unit,
      dto.packageSize,
    );

    // 2. Chamamos o repositório (Persistência)
    // Aqui o dado realmente vai para o seu banco 'precifica_db'
    const savedIngredient = await this.ingredientRepository.save(ingredient);

    return savedIngredient;
  }
}
