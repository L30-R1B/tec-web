import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { RechargeCreditsDto } from './dto/recharge-credits.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: AuthenticatedRequest): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        creditos: import("@prisma/client/runtime/library").Decimal;
        is_admin: boolean;
    }>;
    updateProfile(req: AuthenticatedRequest, updateUserDto: UpdateUserDto): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
    }>;
    rechargeCredits(req: AuthenticatedRequest, rechargeCreditsDto: RechargeCreditsDto): Promise<{
        message: string;
        newBalance: import("@prisma/client/runtime/library").Decimal;
    }>;
    createByAdmin(createUserDto: CreateUserDto): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        is_admin: boolean;
    }>;
    findAll(): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        creditos: import("@prisma/client/runtime/library").Decimal;
        is_admin: boolean;
    }[]>;
    findOne(id: number): Promise<{
        id_usuario: number;
        email: string;
        nome: string;
        creditos: import("@prisma/client/runtime/library").Decimal;
        is_admin: boolean;
    }>;
    remove(id: number): Promise<void>;
}
