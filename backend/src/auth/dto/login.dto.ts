// path: src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;
}
