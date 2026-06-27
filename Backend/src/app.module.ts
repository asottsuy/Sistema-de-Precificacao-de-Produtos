import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@presentation/controllers/app.controller';
import { IngredientsNestModule } from '@presentation/nestjs-modules/ingredients.nest-modules';
import { ProductsNestModule } from '@presentation/nestjs-modules/product.nest-modules';
import { AuthModule } from '@presentation/nestjs-modules/auth.nest-modules';
import { UserModule } from '@presentation/nestjs-modules/user.nest-modules';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'ttsuy',
      password: 'root',
      database: 'precifica_db',
      autoLoadEntities: true,
      synchronize: true, // Isso faz o TypeORM criar as tabelas automaticamente
    }),
    IngredientsNestModule,
    ProductsNestModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

//No nest nada existe se nao estiver registrado em um modulo o appmodule e o modulo raiz, o pai de todos os outros
//ele importa outros modulos. configura a conexao com o banco de dados typeorm e organiza quem pode falar com quem
//na clean archi e ele quem une a infra com a presentation
