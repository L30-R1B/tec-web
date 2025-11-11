// path: src/cards/cards.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsService {
  private readonly CARD_NUMBERS_COUNT = 24; // Cartela 5x5 com centro livre

  constructor(private readonly prisma: PrismaService) {}

  private generateUniqueCardNumbers(): number[] {
    const numbers = new Set<number>();
    while (numbers.size < this.CARD_NUMBERS_COUNT) {
      const num = Math.floor(Math.random() * 75) + 1;
      numbers.add(num);
    }
    return Array.from(numbers);
  }

  async create(createCardDto: CreateCardDto) {
    const { id_jogo, id_usuario } = createCardDto;

    // Verificar se o jogo existe
    const game = await this.prisma.jOGO.findUnique({
      where: { id_jogo },
    });
    if (!game) {
      throw new NotFoundException(`Jogo com ID ${id_jogo} não encontrado.`);
    }

    // Verificar se o usuário existe
    const user = await this.prisma.uSUARIO.findUnique({
      where: { id_usuario },
    });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id_usuario} não encontrado.`);
    }

    // Verificar se o jogo já começou
    if (new Date() >= game.data_hora) {
      throw new BadRequestException('Não é possível criar cartelas para um jogo que já começou.');
    }

    // Gerar números únicos para a cartela
    const cardNumbers = this.generateUniqueCardNumbers();

    // Criar a cartela e seus números em uma transação
    return this.prisma.$transaction(async (tx) => {
      const newCard = await tx.cARTELA.create({
        data: {
          id_jogo,
          id_usuario,
        },
      });

      await tx.nUMEROS_CARTELA.createMany({
        data: cardNumbers.map(numero => ({
          id_cartela: newCard.id_cartela,
          numero,
        })),
      });

      return {
        ...newCard,
        numeros: cardNumbers,
      };
    });
  }

  async findAll(userId?: number, gameId?: number) {
    const where: any = {};

    if (userId) {
      where.id_usuario = userId;
    }

    if (gameId) {
      where.id_jogo = gameId;
    }

    return this.prisma.cARTELA.findMany({
      where,
      include: {
        USUARIO: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          },
        },
        JOGO: {
          select: {
            id_jogo: true,
            data_hora: true,
            SALA: {
              select: {
                nome: true,
              },
            },
          },
        },
        NUMEROS_CARTELA: {
          select: {
            numero: true,
          },
        },
      },
      orderBy: {
        id_cartela: 'desc',
      },
    });
  }

  async findOne(id: number, userId?: number) {
    const where: any = { id_cartela: id };

    // Se userId for fornecido, filtrar apenas cartelas do usuário
    if (userId) {
      where.id_usuario = userId;
    }

    const card = await this.prisma.cARTELA.findUnique({
      where,
      include: {
        USUARIO: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
          },
        },
        JOGO: {
          select: {
            id_jogo: true,
            data_hora: true,
            SALA: {
              select: {
                nome: true,
              },
            },
          },
        },
        NUMEROS_CARTELA: {
          select: {
            numero: true,
          },
          orderBy: {
            numero: 'asc',
          },
        },
      },
    });

    if (!card) {
      throw new NotFoundException(`Cartela com ID ${id} não encontrada.`);
    }

    return card;
  }

  async remove(id: number, userId?: number) {
    const where: any = { id_cartela: id };

    // Se userId for fornecido, verificar se a cartela pertence ao usuário
    if (userId) {
      where.id_usuario = userId;
    }

    const card = await this.prisma.cARTELA.findUnique({
      where,
    });

    if (!card) {
      throw new NotFoundException(`Cartela com ID ${id} não encontrada.`);
    }

    // Verificar se o jogo já começou (não permitir excluir cartelas de jogos em andamento/finalizados)
    const game = await this.prisma.jOGO.findUnique({
      where: { id_jogo: card.id_jogo },
    });

    if (game && new Date() >= game.data_hora) {
      throw new BadRequestException('Não é possível excluir cartelas de um jogo que já começou.');
    }

    await this.prisma.cARTELA.delete({
      where: { id_cartela: id },
    });
  }

  async getUserCards(userId: number, gameId?: number) {
    const where: any = { id_usuario: userId };

    if (gameId) {
      where.id_jogo = gameId;
    }

    return this.prisma.cARTELA.findMany({
      where,
      include: {
        JOGO: {
          select: {
            id_jogo: true,
            data_hora: true,
            SALA: {
              select: {
                nome: true,
              },
            },
          },
        },
        NUMEROS_CARTELA: {
          select: {
            numero: true,
          },
          orderBy: {
            numero: 'asc',
          },
        },
      },
      orderBy: {
        id_cartela: 'desc',
      },
    });
  }
}