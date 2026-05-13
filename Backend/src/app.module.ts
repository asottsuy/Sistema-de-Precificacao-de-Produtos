import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@presentation/controllers/app.controller';
import { IngredientsNestModule } from '@presentation/nestjs-modules/ingredients.nest-module';
import { ProductsNestModule } from '@presentation/nestjs-modules/product.nest-modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      // Se você mudou para 5433 no docker-compose, use 5433 aqui.
      // Se parou o serviço do Windows e usou o padrão, mantenha 5432.
      port: 5433,
      username: 'ttsuy', // Definido no seu docker-compose
      password: 'root', // Definido no seu docker-compose
      database: 'precifica_db', // Definido no seu docker-compose
      autoLoadEntities: true,
      synchronize: true, // Isso faz o TypeORM criar as tabelas automaticamente
    }),
    IngredientsNestModule,
    ProductsNestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

//No nest nada existe se nao estiver registrado em um modulo o appmodule e o modulo raiz, o pai de todos os outros
//ele importa outros modulos. configura a conexao com o banco de dados typeorm e organiza quem pode falar com quem
//na clean archi e ele quem une a infra com a presentation
