import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserUseCase } from '@core/application/use-cases/user/login-user.use-case';

@Controller('auth')
export class AuthController {
  // O Controller recebe o Caso de Uso purificado
  constructor(private readonly loginuserUseCase: LoginUserUseCase) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    try {
      // Passa os dados brutos da requisição HTTP para as regras de negócio
      return await this.loginuserUseCase.execute({
        email: body.email,
        passwordHash: body.password,
      });
    } catch (error) {
      // Se o Caso de Uso lançar um erro (ex: senha errada), o Nest traduz para 401 Unauthorized
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }
}
