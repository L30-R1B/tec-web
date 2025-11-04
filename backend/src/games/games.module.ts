// path: src/games/games.module.ts
import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { BingoEngineModule } from '../bingo-engine/bingo-engine.module';

@Module({
  imports: [BingoEngineModule],
  controllers: [GamesController],
  providers: [GamesService]
})
export class GamesModule {}

