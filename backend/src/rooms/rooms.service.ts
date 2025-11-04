// path: src/rooms/rooms.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../shared/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRoomDto: CreateRoomDto) {
    return this.prisma.sALA.create({ data: createRoomDto });
  }

  findAll() {
    return this.prisma.sALA.findMany({ orderBy: { nome: 'asc' }});
  }

  async findOne(id: number) {
    const room = await this.prisma.sALA.findUnique({ where: { id_sala: id } });
    if (!room) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada.`);
    }
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id);
    return this.prisma.sALA.update({
      where: { id_sala: id },
      data: updateRoomDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.sALA.delete({ where: { id_sala: id } });
  }
}

