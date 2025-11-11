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
    const data: Prisma.PREMIOSCreateInput = {
      descricao: createPrizeDto.descricao,
      valor: new Prisma.Decimal(createPrizeDto.valor),
      JOGO: {
        connect: { id_jogo: createPrizeDto.id_jogo }
      }
    };

    // Conecta o usuário apenas se fornecido
    if (createPrizeDto.id_usuario) {
      data.USUARIO = {
        connect: { id_usuario: createPrizeDto.id_usuario }
      };
    }

    return this.prisma.pREMIOS.create({ 
      data
    });
  }

  findAll() {
    return this.prisma.pREMIOS.findMany({ 
      include: { 
        JOGO: true, 
        USUARIO: { select: { nome: true } } 
      } 
    });
  }

  async findOne(id: number) {
    const prize = await this.prisma.pREMIOS.findUnique({ 
      where: { id_premio: id } 
    });
    if (!prize) {
      throw new NotFoundException(`Prêmio com ID ${id} não encontrado.`);
    }
    return prize;
  }

  async update(id: number, updatePrizeDto: UpdatePrizeDto) {
    await this.findOne(id);
    
    const data: Prisma.PREMIOSUpdateInput = {
      descricao: updatePrizeDto.descricao,
    };

    if (updatePrizeDto.valor) {
      data.valor = new Prisma.Decimal(updatePrizeDto.valor);
    }

    if (updatePrizeDto.id_jogo) {
      data.JOGO = {
        connect: { id_jogo: updatePrizeDto.id_jogo }
      };
    }

    // Conecta o usuário apenas se fornecido, ou desconecta se for null
    if (updatePrizeDto.id_usuario !== undefined) {
      if (updatePrizeDto.id_usuario) {
        data.USUARIO = {
          connect: { id_usuario: updatePrizeDto.id_usuario }
        };
      } else {
        // Remove a relação com usuário se id_usuario for null ou 0
        data.USUARIO = {
          disconnect: true
        };
      }
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
