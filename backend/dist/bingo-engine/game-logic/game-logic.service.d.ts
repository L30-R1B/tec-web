import { PrismaService } from '../../shared/prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
export declare class GameLogicService {
    private readonly prisma;
    private readonly gateway;
    private readonly logger;
    private activeGames;
    constructor(prisma: PrismaService, gateway: RealtimeGateway);
    startGame(gameId: number): Promise<void>;
    private checkForWinner;
    private endGame;
    private distributePrizes;
    private generateShuffledNumbers;
}
