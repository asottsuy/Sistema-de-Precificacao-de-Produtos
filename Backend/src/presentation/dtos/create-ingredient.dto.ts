import {
  IsString,
  IsNumber,
  MinLength,
  IsNotEmpty,
  Min,
} from 'class-validator';
//É a biblioteca que realmente faz o check. Ela verifica se o nome é uma string, se o preço é um número positivo, etc.
//class-transformer: O NestJS usa essa biblioteca para converter o JSON que vem da internet em uma instância da sua classe DTO. Sem ela, o ValidationPipe não consegue "ler" as anotações.

//os decoratores são pipes da lib class-validator
export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do ingrediente é obrigatório' })
  @MinLength(3)
  name!: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'O preço de custo não pode ser negativo' })
  costPrice!: number;

  @IsString()
  @IsNotEmpty({ message: 'A unidade de medida é obrigatória' })
  unit!: string;
}
