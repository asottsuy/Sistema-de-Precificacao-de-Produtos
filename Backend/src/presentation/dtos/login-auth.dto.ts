import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  passwordHash!: string;
}
