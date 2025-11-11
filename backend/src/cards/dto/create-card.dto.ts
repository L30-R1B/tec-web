// path: src/cards/dto/create-card.dto.ts
import { IsInt, IsPositive } from 'class-validator';

export class CreateCardDto {
  @IsInt({ message: 'O ID do jogo deve ser um número inteiro.' })
  @IsPositive({ message: 'O ID do jogo deve ser um número positivo.' })
  id_jogo: number;

  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  @IsPositive({ message: 'O ID do usuário deve ser um número positivo.' })
  id_usuario: number;
}