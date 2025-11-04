import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class GamesService {
    private readonly prisma;
    private readonly CARD_NUMBERS_COUNT;
    private readonly MAX_CARDS_PER_USER;
    constructor(prisma: PrismaService);
    buyCards(userId: number, gameId: number, quantity: number): Promise<{
        message: string;
        cards: any[];
    }>;
    private generateCardNumbers;
    create(createGameDto: CreateGameDto): Prisma.Prisma__JOGOClient<{
        id_jogo: number;
        data_hora: Date;
        preco_cartela: Prisma.Decimal;
        id_sala: number;
        id_usuario_vencedor: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findAll(): Prisma.PrismaPromise<({
        SALA: {
            nome: string;
        };
    } & {
        id_jogo: number;
        data_hora: Date;
        preco_cartela: Prisma.Decimal;
        id_sala: number;
        id_usuario_vencedor: number | null;
    })[]>;
    findOne(id: number): Promise<{
        id_jogo: number;
        data_hora: Date;
        preco_cartela: Prisma.Decimal;
        id_sala: number;
        id_usuario_vencedor: number | null;
    }>;
    findOneWithDetails(id: number): Promise<{
        _count: {
            CARTELA: number;
        };
        SALA: {
            nome: string;
            id_sala: number;
            descricao: string | null;
        };
        NUMEROS_SORTEADOS: {
            id_jogo: number;
            ordem_sorteio: number;
            id_numero_sorteado: number;
            numero: number;
        }[];
    } & {
        id_jogo: number;
        data_hora: Date;
        preco_cartela: Prisma.Decimal;
        id_sala: number;
        id_usuario_vencedor: number | null;
    }>;
    update(id: number, updateGameDto: UpdateGameDto): Promise<{
        id_jogo: number;
        data_hora: Date;
        preco_cartela: Prisma.Decimal;
        id_sala: number;
        id_usuario_vencedor: number | null;
    }>;
    remove(id: number): Promise<void>;
}
