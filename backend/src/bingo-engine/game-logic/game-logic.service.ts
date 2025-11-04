// path: src/bingo-engine/game-logic/game-logic.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { Prisma } from '@prisma/client';

@Injectable()
export class GameLogicService {
  private readonly logger = new Logger(GameLogicService.name);
  private activeGames = new Map<number, boolean>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: RealtimeGateway,
  ) {}

  async startGame(gameId: number) {
    if (this.activeGames.get(gameId)) {
      this.logger.warn(`Tentativa de iniciar o jogo ${gameId} que já está em andamento.`);
      return;
    }

    const game = await this.prisma.jOGO.findUnique({ where: { id_jogo: gameId } });
    if (!game) {
        this.logger.error(`Jogo ${gameId} não encontrado para iniciar.`);
        return;
    }
    if (game.id_usuario_vencedor) {
      this.logger.warn(`Jogo ${gameId} já foi finalizado.`);
      return;
    }

    this.logger.log(`Iniciando o jogo de bingo ID: ${gameId}`);
    this.activeGames.set(gameId, true);

    const numbersToDraw = this.generateShuffledNumbers(1, 75);
    let order = 1;

    // Sorteia um número a cada 5 segundos
    const drawInterval = setInterval(async () => {
      // Para o sorteio se o jogo não estiver mais ativo (ex: servidor reiniciou)
      if(!this.activeGames.get(gameId)) {
          clearInterval(drawInterval);
          this.logger.log(`Sorteio do jogo ${gameId} interrompido.`);
          return;
      }

      if (numbersToDraw.length === 0) {
        clearInterval(drawInterval);
        await this.endGame(gameId, null);
        return;
      }

      const drawnNumber = numbersToDraw.pop();
      this.logger.log(`Jogo ${gameId}: Número sorteado ${drawnNumber} (Ordem: ${order})`);

      try {
        await this.prisma.nUMEROS_SORTEADOS.create({
            data: { id_jogo: gameId, numero: drawnNumber, ordem_sorteio: order },
        });

        this.gateway.broadcastNumber(gameId, drawnNumber, order);
        order++;

        const winnerCard = await this.checkForWinner(gameId);
        if (winnerCard) {
            clearInterval(drawInterval);
            await this.endGame(gameId, winnerCard);
        }
      } catch (error) {
          this.logger.error(`Erro no loop do jogo ${gameId}:`, error);
          clearInterval(drawInterval);
          this.activeGames.delete(gameId);
      }
    }, 5000); 
  }

  private async checkForWinner(gameId: number) {
    const drawnNumbersResult = await this.prisma.nUMEROS_SORTEADOS.findMany({
      where: { id_jogo: gameId },
      select: { numero: true },
    });
    const drawnSet = new Set(drawnNumbersResult.map((n) => n.numero));

    if (drawnSet.size < 24) return null; // Mínimo de números para um bingo padrão (24)

    const cardsInGame = await this.prisma.cARTELA.findMany({
      where: { id_jogo: gameId },
      include: { NUMEROS_CARTELA: { select: { numero: true } } },
    });

    for (const card of cardsInGame) {
      const isWinner = card.NUMEROS_CARTELA.every((num) => drawnSet.has(num.numero));
      if (isWinner) return card;
    }

    return null;
  }

  private async endGame(gameId: number, winningCard: { id_cartela: number, id_usuario: number } | null) {
    if (winningCard) {
      this.logger.log(`Vencedor encontrado para o jogo ${gameId}! Cartela ID: ${winningCard.id_cartela}, Usuário ID: ${winningCard.id_usuario}`);
      await this.prisma.jOGO.update({
        where: { id_jogo: gameId },
        data: { id_usuario_vencedor: winningCard.id_usuario },
      });
      
      const prizeValue = await this.distributePrizes(gameId, winningCard.id_usuario);
      
      this.gateway.broadcastWinner(gameId, {
        userId: winningCard.id_usuario,
        cardId: winningCard.id_cartela,
        prizeValue: prizeValue.toNumber()
      });

    } else {
      this.logger.log(`Jogo ${gameId} finalizado sem vencedores.`);
      this.gateway.broadcastEnd(gameId, "O jogo terminou sem vencedores.");
    }
    this.activeGames.delete(gameId);
  }
  
  private async distributePrizes(gameId: number, winnerId: number): Promise<Prisma.Decimal> {
      const prizes = await this.prisma.pREMIOS.findMany({ where: { id_jogo: gameId }});
      let totalValue = new Prisma.Decimal(0.0);

      for(const prize of prizes) {
          totalValue = totalValue.plus(prize.valor);
      }

      if (totalValue.gt(0)) {
          await this.prisma.uSUARIO.update({
              where: { id_usuario: winnerId },
              data: { creditos: { increment: totalValue } }
          });
          this.logger.log(`Usuário ${winnerId} recebeu ${totalValue} em prêmios do jogo ${gameId}.`);
      }
      return totalValue;
  }

  private generateShuffledNumbers(min: number, max: number): number[] {
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
  }
}

