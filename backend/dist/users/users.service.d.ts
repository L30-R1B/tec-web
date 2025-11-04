import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto, isAdmin: boolean): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        is_admin: boolean;
    }>;
    findAll(): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        creditos: Prisma.Decimal;
        is_admin: boolean;
    }[]>;
    findById(id: number): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        creditos: Prisma.Decimal;
        is_admin: boolean;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
    }>;
    remove(id: number): Promise<void>;
    rechargeCredits(userId: number, amount: number): Promise<{
        message: string;
        newBalance: Prisma.Decimal;
    }>;
}
