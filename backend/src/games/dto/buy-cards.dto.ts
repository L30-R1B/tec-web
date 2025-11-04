// path: src/games/dto/buy-cards.dto.ts
import { IsInt, IsPositive, Max } from 'class-validator';

export class BuyCardsDto {
    @IsInt({ message: "A quantidade deve ser um número inteiro."})
    @IsPositive({ message: "A quantidade deve ser um número positivo."})
    @Max(10, { message: "Você pode comprar no máximo 10 cartelas por vez."})
    quantity: number;
}
