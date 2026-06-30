import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserUseCase } from '@core/application/use-cases/user/login-user.use-case';
import { LoginDto } from '@presentation/dtos/login-auth.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  // O Controller recebe o Caso de Uso purificado
  constructor(private readonly loginuserUseCase: LoginUserUseCase) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async login(@Body() loginDto: LoginDto) {
    try {
      // Passa os dados brutos da requisição HTTP para as regras de negócio
      const token = await this.loginuserUseCase.execute(loginDto);
      return { message: 'Login realizado com sucesso!', token };
    } catch (error: any) {
      // Se o Caso de Uso lançar um erro (ex: senha errada), o Nest traduz para 401 Unauthorized
      throw new UnauthorizedException(error.message);
    }
  }
}
