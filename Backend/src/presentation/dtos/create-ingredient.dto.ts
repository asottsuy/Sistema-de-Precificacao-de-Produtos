import {
  IsString,
  IsNumber,
  MinLength,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
//É a biblioteca que realmente faz o check. Ela verifica se o nome é uma string, se o preço é um número positivo, etc.
//class-transformer: O NestJS usa essa biblioteca para converter o JSON que vem da internet em uma instância da sua classe DTO. Sem ela, o ValidationPipe não consegue "ler" as anotações.

//os decoratores são pipes da lib class-validator
export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do ingrediente é obrigatório' })
  @MinLength(3)
  readonly name!: string;
  //o readonly é um modificador do ts que serve para deixar a prop imutável. ou seja, esse dado não pode mais ser alterado durante o resto do processo.

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'O preço de custo não pode ser negativo' })
  readonly costPrice!: number;

  @IsString()
  @IsNotEmpty({ message: 'A unidade de medida é obrigatória' })
  readonly unit!: string;
}

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
//Usamos o PartialType para dizer que os campos são opcionais
