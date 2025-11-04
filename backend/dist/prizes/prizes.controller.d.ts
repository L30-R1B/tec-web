import { PrizesService } from './prizes.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
export declare class PrizesController {
    private readonly prizesService;
    constructor(prizesService: PrizesService);
    create(createPrizeDto: CreatePrizeDto): import(".prisma/client").Prisma.Prisma__PREMIOSClient<{
        id_usuario: number;
        id_jogo: number;
        descricao: string;
        valor: import("@prisma/client/runtime/library").Decimal;
        id_premio: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        JOGO: {
            id_jogo: number;
            data_hora: Date;
            preco_cartela: import("@prisma/client/runtime/library").Decimal;
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
        valor: import("@prisma/client/runtime/library").Decimal;
        id_premio: number;
    })[]>;
    findOne(id: number): Promise<{
        id_usuario: number;
        id_jogo: number;
        descricao: string;
        valor: import("@prisma/client/runtime/library").Decimal;
        id_premio: number;
    }>;
    update(id: number, updatePrizeDto: UpdatePrizeDto): Promise<{
        id_usuario: number;
        id_jogo: number;
        descricao: string;
        valor: import("@prisma/client/runtime/library").Decimal;
        id_premio: number;
    }>;
    remove(id: number): Promise<void>;
}
