import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { CreateIngredientUseCase } from '@core/application/use-cases/create-ingredient.use-case';
import { CreateIngredientDto } from '../dtos/create-ingredient.dto';
import { UnitValidationPipe } from '@presentation/pipes/unit-validation.pipe';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly createIngredientUseCase: CreateIngredientUseCase,
  ) {}

  @Post()
  @UsePipes(new UnitValidationPipe())
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.createIngredientUseCase.execute(createIngredientDto);
  }
}
