import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly usersService;
    constructor(prisma: PrismaService, jwtService: JwtService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        is_admin: boolean;
    }>;
    getUserFromToken(userId: number): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        creditos: import("@prisma/client/runtime/library").Decimal;
        is_admin: boolean;
    }>;
}
