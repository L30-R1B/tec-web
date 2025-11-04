import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
export declare class RoomsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createRoomDto: CreateRoomDto): import(".prisma/client").Prisma.Prisma__SALAClient<{
        nome: string;
        id_sala: number;
        descricao: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<{
        nome: string;
        id_sala: number;
        descricao: string | null;
    }[]>;
    findOne(id: number): Promise<{
        nome: string;
        id_sala: number;
        descricao: string | null;
    }>;
    update(id: number, updateRoomDto: UpdateRoomDto): Promise<{
        nome: string;
        id_sala: number;
        descricao: string | null;
    }>;
    remove(id: number): Promise<void>;
}
