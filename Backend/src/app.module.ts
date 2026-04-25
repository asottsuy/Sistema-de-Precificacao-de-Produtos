import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsModule } from './ingredients/ingredients.module';

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
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Isso faz o TypeORM criar as tabelas automaticamente
    }),
    IngredientsModule,
  ],
})
export class AppModule {}
