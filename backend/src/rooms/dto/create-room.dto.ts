// path: src/rooms/dto/create-room.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
    @IsString()
    @IsNotEmpty({ message: "O nome da sala é obrigatório."})
    nome: string;

    @IsString()
    @IsOptional()
    descricao?: string;
}
