import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '@core/domain/repositories/user.repository';
import { User } from '@core/domain/entities/user.entity';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly typeOrmRepo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.typeOrmRepo.findOne({ where: { email } });

    if (!userEntity) return null;

    // Converte a entidade do banco para a entidade pura do seu Domínio
    return new User({
      id: userEntity.id,
      email: userEntity.email,
      passwordHash: userEntity.passwordHash,
      nomeRestaurante: userEntity.nomeRestaurante,
    });
  }

  async create(usuario: User): Promise<void> {
    const userEntity = this.typeOrmRepo.create({
      email: usuario.email,
      passwordHash: usuario.passwordHash,
      nomeRestaurante: usuario.nomeRestaurante,
    });

    await this.typeOrmRepo.save(userEntity);
  }
}
