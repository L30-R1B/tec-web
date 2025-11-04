// path: src/rooms/rooms.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // Rotas abaixo são apenas para administradores
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }
  
  @UseGuards(AdminGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.remove(id);
  }

  // Rotas abaixo são abertas para usuários logados
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomsService.findOne(id);
  }
}

