import {
  Controller,
  Param,
  Post,
  Body,
  UsePipes,
  Get,
  ParseIntPipe,
  Delete,
  HttpCode,
  Patch,
  NotFoundException,
  BadRequestException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
//use cases
import { CreateProductUseCase } from '@core/application/use-cases/product/create-product.use-case';
//dtos
import { CreateProductDto } from '@presentation/dtos/create-product.dto';
import { Product } from '../../core/domain/entities/product.entity';
import { ProductRepository } from '../../core/domain/repositories/product.repository';
import { GetProductUseCase } from '../../core/application/use-cases/product/get-products.use-case';
import { GetAllProductsUseCase } from '../../core/application/use-cases/product/list-products.use-case';
import { DeleteProductUseCase } from '@core/application/use-cases/product/delete-product.use-case';
//auth
import { AuthGuard } from '@presentation/common/auth/guards/auth.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    console.log('passei no controller e o param e esse: ', createProductDto);
    return this.createProductUseCase.execute(createProductDto);
  }

  @Get(':id/indicators')
  async getIndicators(@Param('id') id: number) {
    // 1. Busca o produto via Use Case ou Repositório
    const product = await this.getProductUseCase.execute(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // 2. Retorna os cálculos realizados pela entidade
    return {
      productName: product.name,
      salePrice: product.salePrice,
      indicators: {
        totalCost: product.totalCost,
        contributionMargin: product.contributionMargin.toFixed(2),
        markup: product.markup.toFixed(2),
        profitMarginPercentage: `${product.profitMarginPercentage.toFixed(2)}%`,
      },
      isProfitable: product.salePrice > product.totalCost,
    };
  }

  @Patch(':id/price')
  async updatePrice(
    @Param('id') id: number,
    @Body() updateDto: { salePrice: number },
  ) {
    const product = await this.getProductUseCase.execute(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    // APLICAÇÃO DA REGRA DE VALIDAÇÃO DO SEU RELATÓRIO
    if (updateDto.salePrice < product.totalCost) {
      throw new BadRequestException(
        `Alerta: O preço de venda (R$${updateDto.salePrice}) é inferior ao custo de produção (R$${product.totalCost.toFixed(2)})!`,
      );
    }

    // Lógica para salvar o novo preço...
    return { message: 'Preço atualizado com sucesso' };
  }

  @Get()
  async findAll() {
    return this.getAllProductsUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const product = await this.getProductUseCase.execute(id);
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    return product;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteProductUseCase.execute(id);
    return {
      message: 'Produto excluído com sucesso!',
    };
  }
}
