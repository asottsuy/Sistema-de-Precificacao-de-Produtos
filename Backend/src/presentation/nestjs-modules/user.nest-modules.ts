import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@presentation/controllers/user.controller';
import { UserEntity } from '@infra/database/typeorm/entities/user.entity';
import { TypeOrmUserRepository } from '@infra/database/typeorm/repositories/typeorm-user.repository';
import { CriarUsuarioUseCase } from '@core/application/use-cases/user/create-user.use-case';

@Module({
  imports: [
    // Registra a tabela de usuários para este módulo também
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [
    // Configura o repositório de banco de dados
    {
      provide: 'userRepository',
      useClass: TypeOrmUserRepository,
    },
    // Configura a fábrica do caso de uso de criação
    {
      provide: CriarUsuarioUseCase,
      useFactory: (usuarioRepository: TypeOrmUserRepository) => {
        return new CriarUsuarioUseCase(usuarioRepository);
      },
      inject: ['userRepository'],
    },
  ],
  // Exportamos o token do repositório para caso o AuthModule queira usar daqui de dentro!
  exports: ['userRepository'],
})
export class UserModule {}
