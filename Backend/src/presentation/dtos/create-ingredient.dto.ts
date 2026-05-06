import { IsString, IsNumber, MinLength } from 'class-validator';
//É a biblioteca que realmente faz o check. Ela verifica se o nome é uma string, se o preço é um número positivo, etc.
//class-transformer: O NestJS usa essa biblioteca para converter o JSON que vem da internet em uma instância da sua classe DTO. Sem ela, o ValidationPipe não consegue "ler" as anotações.

export class CreateIngredientDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsNumber()
  costPrice!: number;

  @IsString()
  unit!: string;
}
