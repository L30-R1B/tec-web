// path: src/bingo-engine/bingo-engine.module.ts
import { Module } from '@nestjs/common';
import { GameLogicService } from './game-logic/game-logic.service';
import { RealtimeGateway } from './realtime/realtime.gateway';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  providers: [GameLogicService, RealtimeGateway, SchedulerService],
  exports: [GameLogicService] // Exporta para ser usado por outros módulos se necessário
})
export class BingoEngineModule {}

