import { Controller, Post, Body } from '@nestjs/common';
import { CreateIngredientUseCase } from '@core/application/use-cases/create-ingredient.use-case';
import { CreateIngredientDto } from '../dtos/create-ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly createIngredientUseCase: CreateIngredientUseCase,
  ) {}

  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.createIngredientUseCase.execute(createIngredientDto);
  }
}
