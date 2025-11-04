// path: src/games/games.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { BuyCardsDto } from './dto/buy-cards.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post(':id/buy-cards')
  @HttpCode(HttpStatus.OK)
  buyCards(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) gameId: number,
    @Body() buyCardsDto: BuyCardsDto
  ) {
    return this.gamesService.buyCards(req.user.sub, gameId, buyCardsDto.quantity);
  }

  // ===== ROTAS DE ADMINISTRAÇÃO =====
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }
  
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.remove(id);
  }

  // ===== ROTAS PÚBLICAS (PARA USUÁRIOS LOGADOS) =====
  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOneWithDetails(id);
  }
}

