import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importe o TypeORM
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '@infra/cryptography/jwt-token-generator';
import { LoginUserUseCase } from '@core/application/use-cases/user/login-user.use-case';
import { UserEntity } from '@infra/database/typeorm/entities/user.entity'; // Sua entidade do banco de dados
import { TypeOrmUserRepository } from '@infra/database/typeorm/repositories/typeorm-user.repository';

@Module({
  imports: [
    // Diz ao Nest que este módulo vai usar a tabela de Usuários
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: 'SUA_CHAVE_SECRETA_SUPER_SECRETA',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    // Se você criou uma classe que adapta o TypeORM para o Domínio:
    {
      provide: 'userRepository',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: LoginUserUseCase,
      useFactory: (usuarioRepository: any, tokenGenerator: AuthService) => {
        return new LoginUserUseCase(usuarioRepository, tokenGenerator);
      },
      inject: ['userRepository', AuthService], // Agora o Nest sabe quem é 'userRepository'
    },
  ],
})
export class AuthModule {}
