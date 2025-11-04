import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { BuyCardsDto } from './dto/buy-cards.dto';
export declare class GamesController {
    private readonly gamesService;
    constructor(gamesService: GamesService);
    buyCards(req: AuthenticatedRequest, gameId: number, buyCardsDto: BuyCardsDto): Promise<{
        message: string;
        cards: any[];
    }>;
    create(createGameDto: CreateGameDto): import(".prisma/client").Prisma.Prisma__JOGOClient<{
        id_jogo: number;
        data_hora: Date;
        preco_cartela: import("@prisma/client/runtime/library").Decimal;
        id_sala: number;
        id_usuario_vencedor: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateGameDto: UpdateGameDto): Promise<{
        id_jogo: number;
        data_hora: Date;
        preco_cartela: import("@prisma/client/runtime/library").Decimal;
        id_sala: number;
        id_usuario_vencedor: number | null;
    }>;
    remove(id: number): Promise<void>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        SALA: {
            nome: string;
        };
    } & {
        id_jogo: number;
        data_hora: Date;
        preco_cartela: import("@prisma/client/runtime/library").Decimal;
        id_sala: number;
        id_usuario_vencedor: number | null;
    })[]>;
    findOne(id: number): Promise<{
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
        preco_cartela: import("@prisma/client/runtime/library").Decimal;
        id_sala: number;
        id_usuario_vencedor: number | null;
    }>;
}
