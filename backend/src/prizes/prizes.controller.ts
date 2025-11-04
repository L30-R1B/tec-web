// path: src/prizes/prizes.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PrizesService } from './prizes.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@UseGuards(AdminGuard) // Apenas admins podem gerenciar prêmios
@Controller('prizes')
export class PrizesController {
  constructor(private readonly prizesService: PrizesService) {}

  @Post()
  create(@Body() createPrizeDto: CreatePrizeDto) {
    return this.prizesService.create(createPrizeDto);
  }

  @Get()
  findAll() {
    return this.prizesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prizesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePrizeDto: UpdatePrizeDto) {
    return this.prizesService.update(id, updatePrizeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prizesService.remove(id);
  }
}

