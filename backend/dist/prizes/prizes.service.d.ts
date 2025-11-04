import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class PrizesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createPrizeDto: CreatePrizeDto): Prisma.Prisma__PREMIOSClient<{
        id_usuario: number;
        id_jogo: number;
        descricao: string;
        valor: Prisma.Decimal;
        id_premio: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findAll(): Prisma.PrismaPromise<({
        JOGO: {
            id_jogo: number;
            data_hora: Date;
            preco_cartela: Prisma.Decimal;
            id_sala: number;
            id_usuario_vencedor: number | null;
        };
        USUARIO: {
            nome: string;
        };
    } & {
        id_usuario: number;
        id_jogo: number;
        descricao: string;
        valor: Prisma.Decimal;
        id_premio: number;
    })[]>;
    findOne(id: number): Promise<{
        id_usuario: number;
        id_jogo: number;
        descricao: string;
        valor: Prisma.Decimal;
        id_premio: number;
    }>;
    update(id: number, updatePrizeDto: UpdatePrizeDto): Promise<{
        id_usuario: number;
        id_jogo: number;
        descricao: string;
        valor: Prisma.Decimal;
        id_premio: number;
    }>;
    remove(id: number): Promise<void>;
}
