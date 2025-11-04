import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        is_admin: boolean;
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
    }>;
    getProfile(req: AuthenticatedRequest): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        creditos: import("@prisma/client/runtime/library").Decimal;
        is_admin: boolean;
    }>;
}
