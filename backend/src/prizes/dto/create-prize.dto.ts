// path: src/prizes/dto/create-prize.dto.ts
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';

export class CreatePrizeDto {
    @IsString()
    @IsNotEmpty()
    descricao: string;
    
    @IsNumber()
    @IsPositive()
    valor: number;
    
    @IsOptional() // Torna o campo opcional
    @IsNumber()
    @IsPositive()
    id_usuario?: number; // Agora é opcional
    
    @IsNumber()
    @IsPositive()
    id_jogo: number;
}
