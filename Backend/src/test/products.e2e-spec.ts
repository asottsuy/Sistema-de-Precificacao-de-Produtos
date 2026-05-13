import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = app.get(DataSource);

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  beforeEach(async () => {
    // Limpamos as tabelas na ordem correta devido às chaves estrangeiras
    await dataSource.query('DELETE FROM product_items');
    await dataSource.query('DELETE FROM products');
    await dataSource.query('DELETE FROM ingredients');
  });

  it('Deve criar um produto (Ficha Técnica) com sucesso', async () => {
    // 1. Criar o ingrediente base (Café)
    const ingredients = [
      await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'Cafe', costPrice: 38.0, unit: 'g', packageSize: 250 }),

      await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'Leite', costPrice: 6.8, unit: 'l', packageSize: 1 }),

      await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'Acucar', costPrice: 5.5, unit: 'kg', packageSize: 1 }),

      await request(app.getHttpServer()).post('/ingredients').send({
        name: 'Cacau em Po',
        costPrice: 12.0,
        unit: 'g',
        packageSize: 100,
      }),
    ];

    const ingredientsId = ingredients.map((item) => item.body.id);
    console.log('id de ingredientes: ', ingredientsId);

    // 2. Criar o Produto usando o ingrediente criado
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Cappuccino',
        description: 'Cappuccino de 200ml',
        items: [
          {
            ingredientId: ingredientsId[0],
            quantity: 0.015, // 15g de café
          },
          {
            ingredientId: ingredientsId[1],
            quantity: 0.15, // 150ml de leite
          },
          {
            ingredientId: ingredientsId[2],
            quantity: 0.003, // 3g de acucar
          },
          {
            ingredientId: ingredientsId[3],
            quantity: 0.01, // 10g de cacau em po
          },
        ],
      });
    if (response.status === 400) {
      console.log('ERRO DE VALIDAÇÃO:', JSON.stringify(response.body, null, 2));
    }

    // 3. Validações
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Cappuccino');

    // Verificamos se o cálculo de custo (que está na Entidade) refletiu no banco/response
    // 0.015kg * R$ 100.00 = R$ 1.50 de custo
    expect(response.body.items[0].ingredientId).toBe(ingredientsId[0]);
  });

  afterAll(async () => {
    await app.close();
  });
});
