// path: src/cards/cards.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  // ===== ROTAS DE ADMINISTRAÇÃO =====
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('gameId') gameId?: string,
  ) {
    return this.cardsService.findAll(
      userId ? parseInt(userId) : undefined,
      gameId ? parseInt(gameId) : undefined,
    );
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cardsService.findOne(id);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cardsService.remove(id);
  }

  // ===== ROTAS PARA USUÁRIOS LOGADOS =====
  @Get('my/cards')
  getMyCards(
    @Req() req: AuthenticatedRequest,
    @Query('gameId') gameId?: string,
  ) {
    return this.cardsService.getUserCards(
      req.user.sub,
      gameId ? parseInt(gameId) : undefined,
    );
  }

  @Get('my/cards/:id')
  getMyCard(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cardsService.findOne(id, req.user.sub);
  }

  @Delete('my/cards/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMyCard(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cardsService.remove(id, req.user.sub);
  }
}