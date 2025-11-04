// path: src/bingo-engine/scheduler/scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { GameLogicService } from '../game-logic/game-logic.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gameLogicService: GameLogicService,
  ) {}

  // Roda a cada 30 segundos para verificar jogos
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.debug('Verificando jogos agendados para iniciar...');

    const now = new Date();
    // Busca jogos que deveriam ter começado e ainda não tem vencedor
    const gamesToStart = await this.prisma.jOGO.findMany({
      where: {
        data_hora: { lte: now },
        id_usuario_vencedor: null,
      },
    });

    if (gamesToStart.length > 0) {
      this.logger.log(`Encontrados ${gamesToStart.length} jogos para iniciar.`);
      for (const game of gamesToStart) {
        // A lógica no gameLogicService já previne que o mesmo jogo inicie duas vezes
        this.gameLogicService.startGame(game.id_jogo).catch((error) => {
          this.logger.error(
            `Falha ao iniciar o jogo ${game.id_jogo}`,
            error.stack,
          );
        });
      }
    }
  }
}

