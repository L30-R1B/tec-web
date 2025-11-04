// path: src/games/dto/update-game.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';

export class UpdateGameDto extends PartialType(CreateGameDto) {}
