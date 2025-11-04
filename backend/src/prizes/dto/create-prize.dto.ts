// path: src/prizes/dto/create-prize.dto.ts
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreatePrizeDto {
    @IsString()
    @IsNotEmpty()
    descricao: string;
    
    @IsNumber()
    @IsPositive()
    valor: number;
    
    @IsNumber()
    @IsPositive()
    id_usuario: number; // Geralmente, este campo seria o vencedor, que é definido no final do jogo. 
                        // Pode ser removido do DTO de criação e adicionado programaticamente.
                        // Mantido para seguir o esquema.
    
    @IsNumber()
    @IsPositive()
    id_jogo: number;
}
