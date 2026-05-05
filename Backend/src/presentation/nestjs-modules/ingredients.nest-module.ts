//Este arquivo é a "cola" do NestJS para o recurso de ingredientes. Ele registra a entidade no banco e liga o controller ao caso de uso.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsController } from '../controllers/ingredients.controller';
import { IngredientSchema } from '@infra/database/typeorm/entities/ingredient.schema';
import { CreateIngredientUseCase } from '@core/application/use-cases/create-ingredient.use-case';

@Module({
  imports: [
    // Registra a entidade (Schema) para o TypeORM saber que a tabela existe
    TypeOrmModule.forFeature([IngredientSchema]),
  ],
  controllers: [IngredientsController],
  providers: [
    // Aqui você coloca os Use Cases e Repositórios
    CreateIngredientUseCase,
  ],
})
export class IngredientsNestModule {}
