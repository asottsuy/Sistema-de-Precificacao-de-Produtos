import {
  Controller,
  Param,
  Post,
  Body,
  UsePipes,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import {
  CreateIngredientUseCase,
  ListIngredientsUseCase,
  GetIngredientUseCase,
} from '@core/application/use-cases/create-ingredient.use-case';
import { CreateIngredientDto } from '../dtos/create-ingredient.dto';
import { UnitValidationPipe } from '@presentation/pipes/unit-validation.pipe';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    private readonly createIngredientUseCase: CreateIngredientUseCase,
    private readonly listIngredientsUseCase: ListIngredientsUseCase,
    private readonly getIngredientUseCase: GetIngredientUseCase,
  ) {}

  @Post()
  @UsePipes(new UnitValidationPipe())
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
}
