import { UserRepository } from '@core/domain/repositories/user.repository';
import { TokenGenerator } from '@core/application/ports/token-generator.interface';
import * as bcrypt from 'bcrypt';

interface LoginInput {
  email: string;
  passwordHash: string;
}

interface LoginOutput {
  accessToken: string;
}

export class LoginUserUseCase {
  // Inversão de Dependência: o caso de uso exige os contratos no construtor
  constructor(
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator,
    // Aqui entraria também um serviço de Hash para comparar a senha
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    console.log('usuario, ', user);
    if (!user) {
      console.log('caiu aqui, email inválido');
      throw new Error('Credenciais inválidas');
    }
    // 2. Compara a senha enviada com o hash que está na entidade de domínio
    console.log('caiu aqui, senha invalida');
    const passwordBate = await bcrypt.compare(
      input.passwordHash,
      user.passwordHash,
    );
    if (!passwordBate) {
      throw new Error('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };

    const token = this.tokenGenerator.generate(payload);

    return { accessToken: token };
  }
}
