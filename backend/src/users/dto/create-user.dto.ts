// path: src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  nome: string;

  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;
  
  @IsBoolean()
  @IsOptional()
  is_admin?: boolean = false;
}
