// path: src/games/dto/create-game.dto.ts
import { IsDateString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateGameDto {
    @IsDateString({}, { message: "A data e hora devem estar no formato ISO 8601."})
    @IsNotEmpty({ message: "A data e hora do jogo são obrigatórias."})
    data_hora: Date;
    
    @IsNumber()
    @IsPositive()
    id_sala: number;
    
    @IsNumber()
    @IsPositive({ message: "O preço da cartela deve ser um valor positivo."})
    preco_cartela: number;
}
