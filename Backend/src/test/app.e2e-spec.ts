import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../app.module';
//funciona como testes de endpoints
//como roda no proprio servidor o projeto retorna erro na mesmo hora que sobe

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('/ingredients (POST) - Deve barrar unidade inválida', () => {
    return request(app.getHttpServer())
      .post('/ingredients')
      .send({
        name: 'Salmão',
        costPrice: 95.0,
        unit: 'pacote', // Unidade que seu Pipe customizado bloqueia
      })
      .expect(400); // Esperamos que o Pipe barra e retorne erro 400
  });

  afterEach(async () => {
    await app.close();
  });
});
