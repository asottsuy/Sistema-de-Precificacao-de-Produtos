import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CriarUsuarioUseCase } from '@core/application/use-cases/user/create-user.use-case';
import { CreateUserDto } from '@presentation/dtos/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly criarUsuarioUseCase: CriarUsuarioUseCase) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('caiu no controller: ', createUserDto);
    try {
      const resultado = await this.criarUsuarioUseCase.execute(createUserDto);
      return resultado;
    } catch (error: any) {
      // Traduz o erro de negócio do core para uma exceção HTTP do NestJS (400 Bad Request)
      throw new BadRequestException(error.message);
    }
  }
}
