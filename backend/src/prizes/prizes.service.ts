// path: src/prizes/prizes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update-prize.dto';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrizesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPrizeDto: CreatePrizeDto) {
    return this.prisma.pREMIOS.create({ 
      data: {
        ...createPrizeDto,
        valor: new Prisma.Decimal(createPrizeDto.valor),
      }
    });
  }

  findAll() {
    return this.prisma.pREMIOS.findMany({ include: { JOGO: true, USUARIO: {select: { nome: true }} }});
  }

  async findOne(id: number) {
    const prize = await this.prisma.pREMIOS.findUnique({ where: { id_premio: id } });
    if (!prize) {
      throw new NotFoundException(`Prêmio com ID ${id} não encontrado.`);
    }
    return prize;
  }

  async update(id: number, updatePrizeDto: UpdatePrizeDto) {
    await this.findOne(id);
    const data: Prisma.PREMIOSUpdateInput = { ...updatePrizeDto };
    if(updatePrizeDto.valor) {
      data.valor = new Prisma.Decimal(updatePrizeDto.valor);
    }
    return this.prisma.pREMIOS.update({
      where: { id_premio: id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.pREMIOS.delete({ where: { id_premio: id } });
  }
}

