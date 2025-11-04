import { PrismaService } from '../../shared/prisma/prisma.service';
import { GameLogicService } from '../game-logic/game-logic.service';
export declare class SchedulerService {
    private readonly prisma;
    private readonly gameLogicService;
    private readonly logger;
    constructor(prisma: PrismaService, gameLogicService: GameLogicService);
    handleCron(): Promise<void>;
}
