import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm'; // Importe o TypeORM
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '@infra/cryptography/jwt-token-generator';
import { LoginUserUseCase } from '@core/application/use-cases/user/login-user.use-case';
import { UserEntity } from '@infra/database/typeorm/entities/user.entity'; // Sua entidade do banco de dados
import { TypeOrmUserRepository } from '@infra/database/typeorm/repositories/typeorm-user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Diz ao Nest que este módulo vai usar a tabela de Usuários
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
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
