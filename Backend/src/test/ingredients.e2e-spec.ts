import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

describe('Ingredients (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Primeiro pegamos a instância do DataSource do app criado
    dataSource = app.get(DataSource);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });
  beforeEach(async () => {
    await dataSource.query('DELETE FROM ingredients');
  });

  //teste do post de ingredientes (criando)
  describe('/ingredients (POST)', () => {
    it('Deve criar um ingrediente com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send({
          name: 'Cafe Arabica',
          costPrice: 135.5,
          unit: 'kg',
          packageSize: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Cafe Arabica');
    });

    it('Deve retornar 400 ao enviar unidade de medida inválida (Pipe Test)', async () => {
      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send({
          name: 'Erro de Unidade',
          costPrice: 10,
          unit: 'pacote', // Unidade não permitida no seu UnitValidationPipe
        });

      expect(response.status).toBe(400);
    });

    it('Deve retornar 409 ao tentar criar ingrediente com nome duplicado', async () => {
      // Primeiro criamos um
      await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'Repetido', costPrice: 10, unit: 'un', packageSize: 1 });

      // Tentamos criar o mesmo nome novamente
      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'Repetido', costPrice: 20, unit: 'un', packageSize: 1 });

      expect(response.status).toBe(409); // ConflictException
      expect(response.body.message).toBe('Esse ingrediente já existe!');
    });
  });

  //teste da remocao de ingrediente
  describe('/ingredients/:id (DELETE)', () => {
    it('Deve deletar um ingrediente e retornar mensagem de sucesso', async () => {
      // 1. Criamos um ingrediente para ter certeza que ele existe
      const createRes = await request(app.getHttpServer())
        .post('/ingredients')
        .send({
          name: 'Ingrediente para Deletar',
          costPrice: 10,
          unit: 'un',
          packageSize: 1,
        });

      const id = createRes.body.id;
      console.log('id": ', id);

      // 2. Executamos a remoção
      const response = await request(app.getHttpServer()).delete(
        `/ingredients/${id}`,
      );

      // 3. Validações
      expect(response.status).toBe(200); // Mudamos para 200 para aceitar o body
      expect(response.body.message).toBe('Ingrediente excluído com sucesso!');

      // 4. Validação extra: tentar buscar o ingrediente deletado deve dar 404
      const getRes = await request(app.getHttpServer()).get(
        `/ingredients/${id}`,
      );
      expect(getRes.status).toBe(404);
    });

    it('Deve retornar 404 ao tentar deletar um ingrediente que não existe', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/ingredients/99999',
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        'Ingrediente não encontrado para remoção.',
      );
    });
  });

  //teste da atualizacao de um ingrediente
  describe('/ingredients/:id (PATCH)', () => {
    it('Deve atualizar o preço de um ingrediente com sucesso', async () => {
      // 1. Criamos o ingrediente
      const createRes = await request(app.getHttpServer())
        .post('/ingredients')
        .send({
          name: 'Café para Update',
          costPrice: 100,
          unit: 'kg',
          packageSize: 1,
        });

      const id = createRes.body.id;

      // 2. Atualizamos apenas o preço
      const response = await request(app.getHttpServer())
        .patch(`/ingredients/${id}`)
        .send({ costPrice: 150.0 });

      expect(response.status).toBe(200);
      expect(response.body.costPrice).toBe(150.0);
      expect(response.body.name).toBe('Café para Update'); // Nome deve continuar o mesmo
    });
  });

  //teste do GET de ingredientes
  describe('/ingredients (GET)', () => {
    it('Deve retornar uma lista de ingredientes', async () => {
      // Criamos dois insumos
      await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'Cafe', costPrice: 38.0, unit: 'g', packageSize: 250 });

      await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'Leite', costPrice: 6.8, unit: 'l', packageSize: 1 });

      const response = await request(app.getHttpServer()).get('/ingredients');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
