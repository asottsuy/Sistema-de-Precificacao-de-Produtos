//Ela apenas diz quais métodos existem (ex: save(ingredient: Ingredient): Promise<void>), sem dizer como o banco funciona.
// src/core/domain/repositories/ingredient.repository.ts
import { Ingredient } from '../entities/ingredient.entity';

// Esse é o "contrato"
//responsavel pela abstração e acesso ao banco de dados
export abstract class IngredientRepository {
  abstract save(ingredient: Ingredient): Promise<void>;
}
