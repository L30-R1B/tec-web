// path: src/users/dto/recharge-credits.dto.ts
import { IsNumber, IsPositive } from 'class-validator';

export class RechargeCreditsDto {
    @IsNumber({}, { message: "O valor deve ser um número."})
    @IsPositive({ message: "O valor da recarga deve ser positivo."})
    amount: number;
}
