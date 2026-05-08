import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsController } from '../controllers/ingredients.controller';
import { IngredientSchema } from '@infra/database/typeorm/entities/ingredient.schema';
import { CreateIngredientUseCase } from '@core/application/use-cases/create-ingredient.use-case';
import { IngredientRepository } from '@core/domain/repositories/ingredient.repository';
import { TypeOrmIngredientRepository } from '@infra/database/typeorm/repositories/typeorm-ingredient.repository';
//Este arquivo é a "cola" do NestJS para o recurso de ingredientes. Ele registra a entidade no banco e liga o controller ao caso de uso.
@Module({
  imports: [
    // Registra a entidade (Schema) para o TypeORM saber que a tabela existe
    TypeOrmModule.forFeature([IngredientSchema]),
  ],
  controllers: [IngredientsController],
  providers: [
    // Aqui você coloca os Use Cases e Repositórios
    CreateIngredientUseCase, //usecase de ingrediente
    {
      provide: IngredientRepository, //Injeção de dependencia, toda vez que o usecase solicitar o IngredientRepository, ele não sabe de fato como o dado é salvo no banco, ele conhece apenas a abrastração.
      //Portanto, esse objeto dentro dos providers no nest passa para ele um objeto (classe) de TypeORmIngredientes.
      //dessa forma a unica coisa que preciso mudar caso o banco seja outro seria a camda de infra.
      useClass: TypeOrmIngredientRepository,
    },
  ],
})
export class IngredientsNestModule {}
