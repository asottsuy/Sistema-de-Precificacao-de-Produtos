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

describe('Ingredients (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = app.get(DataSource);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    console.log(
      `\n${BOLD}${CYAN}====================================================`,
    );
    console.log(`🚀 INICIANDO DEMONSTRAÇÃO DO SISTEMA DE PRECIFICAÇÃO`);
    console.log(
      `====================================================${RESET}\n`,
    );
  });

  beforeEach(async () => {
    await dataSource.query('DELETE FROM ingredients');
  });

  // teste do post de ingredientes (criando)
  describe('/ingredients (POST)', () => {
    it('Deve criar um ingrediente com sucesso', async () => {
      console.log(
        `${BOLD}${YELLOW}📌 CASO DE USO: Cadastro de Novo Ingrediente${RESET}`,
      );

      const payload = {
        name: 'Cafe Arabica',
        costPrice: 135.5,
        unit: 'kg',
        packageSize: 1,
      };

      console.log('📥 Enviando dados para o servidor:', payload);

      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Cafe Arabica');

      console.log(
        `${GREEN}✅ Sucesso! Resposta do Servidor (Ingrediente Criado):${RESET}`,
      );
      console.table([response.body]);
      console.log('\n----------------------------------------------------\n');
    });

    it('Deve retornar 400 ao enviar unidade de medida inválida (Pipe Test)', async () => {
      console.log(
        `${BOLD}${YELLOW}📌 REGRA DE NEGÓCIO: Validação de Unidade de Medida (Filtro do Sistema)${RESET}`,
      );

      const payload = {
        name: 'Erro de Unidade',
        costPrice: 10,
        unit: 'pacote', // Unidade não permitida
      };

      console.log('📥 Tentando enviar unidade inválida ("pacote"):', payload);

      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send(payload);

      expect(response.status).toBe(400);

      console.log(
        `${RED}❌ Sistema bloqueou corretamente! Código 400 (Bad Request).${RESET}`,
      );
      console.log('Mensagem de erro retornada:', response.body.message);
      console.log('\n----------------------------------------------------\n');
    });

    it('Deve retornar 409 ao tentar criar ingrediente com nome duplicado', async () => {
      console.log(
        `${BOLD}${YELLOW}📌 REGRA DE NEGÓCIO: Impedir Ingredientes Duplicados (Unicidade)${RESET}`,
      );

      // Primeiro criamos um
      await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'Repetido', costPrice: 10, unit: 'un', packageSize: 1 });

      console.log(
        '📥 Tentando cadastrar um segundo ingrediente com o mesmo nome: "Repetido"',
      );

      const response = await request(app.getHttpServer())
        .post('/ingredients')
        .send({ name: 'Repetido', costPrice: 20, unit: 'un', packageSize: 1 });

      expect(response.status).toBe(409); // ConflictException
      expect(response.body.message).toBe('Esse ingrediente já existe!');

      console.log(
        `${RED}❌ Sistema barrou a duplicidade! Código 409 (Conflict).${RESET}`,
      );
      console.log(`Mensagem tratada: "${response.body.message}"`);
      console.log('\n----------------------------------------------------\n');
    });
  });

  // teste da remocao de ingrediente
  describe('/ingredients/:id (DELETE)', () => {
    it('Deve deletar um ingrediente e retornar mensagem de sucesso', async () => {
      console.log(
        `${BOLD}${YELLOW}📌 CASO DE USO: Remoção Segura de Ingredientes${RESET}`,
      );

      const createRes = await request(app.getHttpServer())
        .post('/ingredients')
        .send({
          name: 'Ingrediente para Deletar',
          costPrice: 10,
          unit: 'un',
          packageSize: 1,
        });

      const id = createRes.body.id;
      console.log(
        `📦 Ingrediente temporário criado para o teste. ID gerado: ${id}`,
      );

      console.log(`🗑️ Executando a rota: DELETE /ingredients/${id}`);
      const response = await request(app.getHttpServer()).delete(
        `/ingredients/${id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Ingrediente excluído com sucesso!');

      console.log(
        `${GREEN}✅ Remoção efetuada! Mensagem do sistema: "${response.body.message}"${RESET}`,
      );
      console.log('\n----------------------------------------------------\n');
    });
  });

  // teste da atualizacao de um ingrediente
  describe('/ingredients/:id (PATCH)', () => {
    it('Deve atualizar o preço de um ingrediente com sucesso', async () => {
      console.log(
        `${BOLD}${YELLOW}📌 CASO DE USO: Atualização de Preço de Custo (Insumo/Mercado)${RESET}`,
      );

      const createRes = await request(app.getHttpServer())
        .post('/ingredients')
        .send({
          name: 'Café para Update',
          costPrice: 100.0,
          unit: 'kg',
          packageSize: 1,
        });

      const id = createRes.body.id;
      console.log(
        `📦 Ingrediente cadastrado originalmente com Preço de Custo: R$ 100.00`,
      );
      console.log(
        `📥 Atualizando o preço para R$ 150.00 via PATCH /ingredients/${id}`,
      );

      const response = await request(app.getHttpServer())
        .patch(`/ingredients/${id}`)
        .send({ costPrice: 150.0 });

      expect(response.status).toBe(200);
      expect(response.body.costPrice).toBe(150.0);

      console.log(
        `${GREEN}✅ Preço atualizado com sucesso! Dados atuais do insumo:${RESET}`,
      );
      console.table([response.body]);
      console.log('\n----------------------------------------------------\n');
    });
  });

  // teste do GET de ingredientes
  describe('/ingredients (GET)', () => {
    it('Deve retornar uma lista de ingredientes', async () => {
      console.log(
        `${BOLD}${YELLOW}📌 CASO DE USO: Listagem Geral de Ingredientes Cadastrados${RESET}`,
      );

      // Criamos dois insumos
      await request(app.getHttpServer())
        .post('/ingredients')
        .send({
          name: 'Cafe Bourbon',
          costPrice: 38.0,
          unit: 'g',
          packageSize: 250,
        });

      await request(app.getHttpServer())
        .post('/ingredients')
        .send({
          name: 'Leite Integral',
          costPrice: 6.8,
          unit: 'l',
          packageSize: 1,
        });

      console.log('🔍 Buscando todos os registros na rota: GET /ingredients');
      const response = await request(app.getHttpServer()).get('/ingredients');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      console.log(
        `${GREEN}📋 Dados armazenados no banco de dados encontrados (${response.body.length} itens):${RESET}`,
      );
      console.table(response.body);
      console.log('\n----------------------------------------------------\n');
    });
  });

  afterAll(async () => {
    console.log(
      `\n${BOLD}${CYAN}====================================================`,
    );
    console.log(`🏁 FIM DA APRESENTAÇÃO DOS CASOS DE TESTE`);
    console.log(
      `====================================================${RESET}\n`,
    );
    await app.close();
  });
});
