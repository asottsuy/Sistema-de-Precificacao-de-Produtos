export interface TokenPayload {
  sub: string; // ID do usuário
  email: string;
}

export interface TokenGenerator {
  generate(payload: any): string;
}

//contrato do Token, define como o token deve ser gerado
