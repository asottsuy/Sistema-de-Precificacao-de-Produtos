export interface UserProps {
  id?: string;
  email: string;
  passwordHash: string;
  nomeRestaurante: string;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.props = props;
  }

  // Getters e regras de negócio se houver (ex: validar formato de email)
  get id() {
    return this.props.id;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get nomeRestaurante(): string {
    return this.props.nomeRestaurante;
  }
}
