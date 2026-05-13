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
} from '@nestjs/common';
//use cases
import { CreateIngredientUseCase } from '@core/application/use-cases/create-ingredient.use-case';
import { UpdateIngredientUseCase } from '@core/application/use-cases/update-ingredient.use-case';
import { ListIngredientsUseCase } from '@core/application/use-cases/list-ingredient.use-case';
import { GetIngredientUseCase } from '@core/application/use-cases/get-ingredients.use-case';
import { DeleteIngredientUseCase } from '@core/application/use-cases/delete-ingredients.use-case';
//dtos
import {
  CreateIngredientDto,
  UpdateIngredientDto,
} from '../dtos/create-ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly createIngredientUseCase: CreateIngredientUseCase,
    private readonly listIngredientsUseCase: ListIngredientsUseCase,
    private readonly getIngredientUseCase: GetIngredientUseCase,
    private readonly deleteIngredientUseCase: DeleteIngredientUseCase,
    private readonly updateIngredientUseCase: UpdateIngredientUseCase,
  ) {}

  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.createIngredientUseCase.execute(createIngredientDto);
  }

  @Get()
  async findAll() {
    return this.listIngredientsUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.getIngredientUseCase.execute(id);
  }

  @Delete(':id')
  // Removemos o 204 para permitir o envio de um corpo na resposta
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.deleteIngredientUseCase.execute(id);

    // Agora o front-end pode capturar essa string para um Toast ou Alerta
    return {
      message: 'Ingrediente excluído com sucesso!',
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.updateIngredientUseCase.execute(id, updateIngredientDto);
  }
}
