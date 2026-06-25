import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  TokenPayload,
  TokenGenerator,
} from '../../core/application/ports/token-generator.interface';

@Injectable()
export class AuthService implements TokenGenerator {
  // Injetamos o JwtService nativo do NestJS
  constructor(private readonly jwtService: JwtService) {}

  // Realiza a geração do token exigida pelo Caso de Uso
  generate(payload: TokenPayload): string {
    return this.jwtService.sign(payload);
  }
}
