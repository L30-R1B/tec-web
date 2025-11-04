// path: src/users/dto/update-user.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' })
  @IsOptional()
  senha?: string;
}
