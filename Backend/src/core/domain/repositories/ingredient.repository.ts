//Ela apenas diz quais métodos existem (ex: save(ingredient: Ingredient): Promise<void>), sem dizer como o banco funciona.
// src/core/domain/repositories/ingredient.repository.ts
import { Ingredient } from '../entities/ingredient.entity';

// Esse é o "contrato"
//responsavel pela abstração e acesso ao banco de dados
export abstract class IngredientRepository {
  abstract save(ingredient: Ingredient): Promise<Ingredient>;
  abstract findByName(name: string): Promise<Ingredient | null>;
  abstract findAll(): Promise<Ingredient[]>;
  abstract findById(id: number): Promise<Ingredient | null>;
  abstract deleteById(id: number): Promise<void>;
}
