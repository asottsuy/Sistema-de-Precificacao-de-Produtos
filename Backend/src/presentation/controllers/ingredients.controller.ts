import {
  Controller,
  Param,
  Post,
  Body,
  Get,
  ParseIntPipe,
  Delete,
  Patch,
  UseGuards,
  Inject,
} from '@nestjs/common';
//use cases
import { CreateIngredientUseCase } from '@core/application/use-cases/ingredient/create-ingredient.use-case';
import { UpdateIngredientUseCase } from '@core/application/use-cases/ingredient/update-ingredient.use-case';
import { ListIngredientsUseCase } from '@core/application/use-cases/ingredient/list-ingredient.use-case';
import { GetIngredientUseCase } from '@core/application/use-cases/ingredient/get-ingredients.use-case';
import { DeleteIngredientUseCase } from '@core/application/use-cases/ingredient/delete-ingredients.use-case';
import {
  CreateIngredientDto,
  UpdateIngredientDto,
} from '../dtos/create-ingredient.dto';
import { AuthGuard } from '@presentation/common/auth/guards/auth.guard';
import {
  CacheTTL,
  CACHE_MANAGER,
  CacheInterceptor,
} from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Controller('ingredients')
@UseGuards(AuthGuard)
export class IngredientsController {
  constructor(
    private readonly createIngredientUseCase: CreateIngredientUseCase,
    private readonly listIngredientsUseCase: ListIngredientsUseCase,
    private readonly getIngredientUseCase: GetIngredientUseCase,
    private readonly deleteIngredientUseCase: DeleteIngredientUseCase,
    private readonly updateIngredientUseCase: UpdateIngredientUseCase,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.createIngredientUseCase.execute(createIngredientDto);
  }

  @Get()
  async findAll() {
    return this.listIngredientsUseCase.execute();
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  @CacheTTL(60000)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getIngredientUseCase.execute(id);
  }

  @Delete(':id')
  // Removemos o 204 para permitir o envio de um corpo na resposta
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteIngredientUseCase.execute(id);

    // Agora o front-end pode capturar essa string para um Toast ou Alerta
    await this.invalidarCacheIngrediente(id);
    return {
      message: 'Ingrediente excluído com sucesso!',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    await this.invalidarCacheIngrediente(id);
    return this.updateIngredientUseCase.execute(id, updateIngredientDto);
  }

  private async invalidarCacheIngrediente(id: number): Promise<void> {
    const cacheKey = `/ingredients/${id}`;
    console.log(`Caiou aquiiiii no uivalidar chaceh ingrendietn: ${cacheKey} `);
    await this.cacheManager.del(cacheKey);
    console.log(`Cache limpo para a chave: ${cacheKey} 🧹`);
  }
}
