import { NestFactory } from '@nestjs/core';
//cria a instancia do nest baseada no meu appmodule
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import { AllExceptionFilter } from './presentation/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('manager/');
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      //o pipe fica antes de chegar ao controller
      whitelist: true, // Remove campos extras enviados no JSON
      forbidNonWhitelisted: true, // Retorna erro se enviarem campos extras
      transform: true, // Converte os tipos automaticamente (ex: string para number)
    }),
  );
  app.enableCors();
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Aplicação rodando em: http://localhost:${port}/manager`);
}
bootstrap();

//ponto de entrada da aplicacao
//usa a nestFactory para ler o modulo raiz e subir o servidor HTTP
//define as portas de execucao, configura prefixos globais como /api  e ativa middlewares globais como validacao de dados
//na clean arquitechture ele fica na camada de presentation
