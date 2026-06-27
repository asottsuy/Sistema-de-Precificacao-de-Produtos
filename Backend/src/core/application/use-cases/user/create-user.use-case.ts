import { User } from '@core/domain/entities/user.entity';
import { UserRepository } from '@core/domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';

interface CriarUsuarioInput {
  email: string;
  passwordHash: string;
  nomeRestaurante: string;
}

interface CriarUsuarioOutput {
  id?: string;
  email: string;
  nomeRestaurante: string;
}

export class CriarUsuarioUseCase {
  constructor(private readonly usuarioRepository: UserRepository) {}

  async execute(input: CriarUsuarioInput): Promise<CriarUsuarioOutput> {
    // 1. Valida se o e-mail já está cadastrado
    const usuarioExiste = await this.usuarioRepository.findByEmail(input.email);
    console.log('ususario repedito');
    if (usuarioExiste) {
      throw new Error('E-mail já cadastrado no sistema');
    }

    // 2. Criptografa a senha antes de salvar
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.passwordHash, saltRounds);

    // 3. Cria a entidade de domínio do Usuário
    const novoUsuario = new User({
      email: input.email,
      passwordHash,
      nomeRestaurante: input.nomeRestaurante,
    });

    // 4. Salva no banco através do repositório
    await this.usuarioRepository.create(novoUsuario);

    return {
      id: novoUsuario.id,
      email: novoUsuario.email,
      nomeRestaurante: novoUsuario.nomeRestaurante,
    };
  }
}
