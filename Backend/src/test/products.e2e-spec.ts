import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

// Cores para o terminal
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdProductId: number;
  let ingredientsId: number[] = [];

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

    await dataSource.query('DELETE FROM product_items');
    await dataSource.query('DELETE FROM products');
    await dataSource.query('DELETE FROM ingredients');

    console.log(
      `\n${BOLD}${CYAN}======================================================`,
    );
    console.log(`📊 MÓDULO DE PRODUTOS & ENGENHARIA FINANCEIRA (CMV)`);
    console.log(
      `======================================================${RESET}\n`,
    );
  });

  it('1. Deve criar os ingredientes e o produto (Ficha Técnica) com sucesso', async () => {
    console.log(
      `${BOLD}${YELLOW}📌 CASO DE USO: Geração da Ficha Técnica (Product & Items)${RESET}`,
    );
    console.log(
      '⏳ Cadastrando insumos com base em preços reais de mercado (Atacado/Fornecedores)...',
    );

    // Padronizados para unidades inteiras (kg/l) para que a fração decimal da receita funcione perfeitamente
    const ingredients = [
      await request(app.getHttpServer()).post('/ingredients').send({
        name: 'Cafe Gourmet Espreso',
        costPrice: 135.5,
        unit: 'kg',
        packageSize: 1,
      }),

      await request(app.getHttpServer()).post('/ingredients').send({
        name: 'Leite Integral Barista',
        costPrice: 6.8,
        unit: 'l',
        packageSize: 1,
      }),

      await request(app.getHttpServer()).post('/ingredients').send({
        name: 'Acucar Refinado',
        costPrice: 5.5,
        unit: 'kg',
        packageSize: 1,
      }),

      await request(app.getHttpServer()).post('/ingredients').send({
        name: 'Cacau em Po 50%',
        costPrice: 120.0,
        unit: 'kg',
        packageSize: 1,
      }),
    ];

    ingredientsId = ingredients.map((item) => item.body.id);
    console.log(
      `${GREEN}✅ Insumos gerados com sucesso! IDs vinculados:${RESET}`,
      ingredientsId,
    );

    const productPayload = {
      name: 'Cappuccino Premium',
      description: 'Cappuccino Italiano de 200ml',
      salePrice: 14.0, // Preço de venda sugerido condizente com cafeterias specialty
      items: [
        { ingredientId: ingredientsId[0], quantity: 0.015 }, // 15g de café
        { ingredientId: ingredientsId[1], quantity: 0.15 }, // 150ml de leite
        { ingredientId: ingredientsId[2], quantity: 0.01 }, // 10g de açúcar
        { ingredientId: ingredientsId[3], quantity: 0.01 }, // 10g de cacau
      ],
    };

    console.log('📥 Enviando Ficha Técnica para a rota: POST /products');

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(productPayload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Cappuccino Premium');

    createdProductId = response.body.id;

    console.log(
      `${GREEN}✅ Produto e Ficha Técnica criados com sucesso!${RESET}`,
    );
    console.log(
      `📦 Produto: ${BOLD}${response.body.name}${RESET} | ID do Banco: ${BOLD}${createdProductId}${RESET}`,
    );
    console.log('\n📄 Estrutura salva da Ficha Técnica (ProductItems):');
    console.table(
      response.body.items.map((item: any) => ({
        'ID Item': item.id,
        'ID Ingrediente': item.ingredientId,
        'Qtd Usada (kg/l)': item.quantity,
      })),
    );
    console.log('\n------------------------------------------------------\n');
  });

  it('2. Deve calcular corretamente os indicadores financeiros de um produto', async () => {
    console.log(
      `${BOLD}${YELLOW}📌 CASO DE USO: Motor de Cálculo Financeiro (CMV, Margem e Markup)${RESET}`,
    );
    console.log(
      `📈 Ajustando Preço de Venda para R$ 14.00 via PATCH /products/${createdProductId}/price`,
    );

    await request(app.getHttpServer())
      .patch(`/products/${createdProductId}/price`)
      .send({ salePrice: 14.0 });

    console.log(
      `🔍 Buscando Relatório de Indicadores: GET /products/${createdProductId}/indicators`,
    );

    const response = await request(app.getHttpServer())
      .get(`/products/${createdProductId}/indicators`)
      .expect(200);

    // Validações comerciais baseadas no custo real calculado de R$ 4.31
    expect(response.body.productName).toBe('Cappuccino Premium');
    expect(Number(response.body.salePrice)).toBe(14.0);
    expect(Number(response.body.indicators.markup)).toBeCloseTo(3.25, 1); // 14.00 / 4.31
    expect(Number(response.body.indicators.contributionMargin)).toBeCloseTo(
      9.69,
      1,
    ); // 14.00 - 4.31
    expect(response.body.indicators.profitMarginPercentage).toContain('%');
    expect(response.body.isProfitable).toBe(true);

    console.log(`${GREEN}✅ Relatório Financeiro Gerado com Sucesso!${RESET}`);
    console.log(`Nome do Produto: ${BOLD}${response.body.productName}${RESET}`);
    console.log(
      `Preço de Venda:  ${GREEN}R$ ${Number(response.body.salePrice).toFixed(2)}${RESET}`,
    );

    console.log(
      '\n📊 Indicadores Calculados pela Entidade (Margens Reais de Mercado):',
    );
    console.table({
      'CMV Total (Custo Insumos)': {
        // Adicione o Number() aqui no teste também para limpar qualquer string residual do JSON
        Valor: `R$ ${Number(response.body.indicators.totalCost).toFixed(2)}`,
      },
      Markup: { Valor: Number(response.body.indicators.markup).toFixed(2) },
      // ... resto do código
    });
    console.table({
      'CMV Total (Custo Insumos)': {
        Valor: `R$ ${Number(response.body.indicators.totalCost).toFixed(2)}`,
      },
      Markup: { Valor: Number(response.body.indicators.markup).toFixed(2) },
      'Margem de Contribuição': {
        Valor: `R$ ${Number(response.body.indicators.contributionMargin).toFixed(2)}`,
      },
      'Margem de Lucro (%)': {
        Valor: response.body.indicators.profitMarginPercentage,
      },
      'Status de Lucratividade': {
        Valor: response.body.isProfitable
          ? '🟢 LUCRATIVO (CMV Saudável ~30%)'
          : '🔴 PREJUÍZO',
      },
    });
    console.log('\n------------------------------------------------------\n');
  });

  it('3. Deve alertar quando o preço de venda for menor que o custo', async () => {
    console.log(
      `${BOLD}${YELLOW}📌 REGRA DE NEGÓCIO: Alerta de Margem Negativa (Prevenção de Prejuízo)${RESET}`,
    );

    const lowPriceDto = { salePrice: 3.5 }; // R$ 3.50 fica abaixo do custo de fabricação que é R$ 4.31
    console.log(
      `⚠️ Forçando Preço abaixo do custo do CMV: R$ 3.50 (PATCH /products/${createdProductId}/price)`,
    );

    const response = await request(app.getHttpServer())
      .patch(`/products/${createdProductId}/price`)
      .send(lowPriceDto);

    // Validações
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Alerta: O preço de venda');

    console.log(
      `${RED}❌ Validação do Sistema Ativada! Código 400 (Bad Request).${RESET}`,
    );
    console.log(
      `🚨 Mensagem do Alerta Financeiro: ${BOLD}"${response.body.message}"${RESET}`,
    );
    console.log('\n------------------------------------------------------\n');
  });

  afterAll(async () => {
    console.log(
      `\n${BOLD}${CYAN}======================================================`,
    );
    console.log(`🏁 FIM DO MÓDULO DE ENGENHARIA FINANCEIRA`);
    console.log(
      `======================================================${RESET}\n`,
    );
    await app.close();
  });
});
