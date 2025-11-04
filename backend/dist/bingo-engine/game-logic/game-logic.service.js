"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GameLogicService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogicService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../shared/prisma/prisma.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const client_1 = require("@prisma/client");
let GameLogicService = GameLogicService_1 = class GameLogicService {
    constructor(prisma, gateway) {
        this.prisma = prisma;
        this.gateway = gateway;
        this.logger = new common_1.Logger(GameLogicService_1.name);
        this.activeGames = new Map();
    }
    async startGame(gameId) {
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
        const drawInterval = setInterval(async () => {
            if (!this.activeGames.get(gameId)) {
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
            }
            catch (error) {
                this.logger.error(`Erro no loop do jogo ${gameId}:`, error);
                clearInterval(drawInterval);
                this.activeGames.delete(gameId);
            }
        }, 5000);
    }
    async checkForWinner(gameId) {
        const drawnNumbersResult = await this.prisma.nUMEROS_SORTEADOS.findMany({
            where: { id_jogo: gameId },
            select: { numero: true },
        });
        const drawnSet = new Set(drawnNumbersResult.map((n) => n.numero));
        if (drawnSet.size < 24)
            return null;
        const cardsInGame = await this.prisma.cARTELA.findMany({
            where: { id_jogo: gameId },
            include: { NUMEROS_CARTELA: { select: { numero: true } } },
        });
        for (const card of cardsInGame) {
            const isWinner = card.NUMEROS_CARTELA.every((num) => drawnSet.has(num.numero));
            if (isWinner)
                return card;
        }
        return null;
    }
    async endGame(gameId, winningCard) {
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
        }
        else {
            this.logger.log(`Jogo ${gameId} finalizado sem vencedores.`);
            this.gateway.broadcastEnd(gameId, "O jogo terminou sem vencedores.");
        }
        this.activeGames.delete(gameId);
    }
    async distributePrizes(gameId, winnerId) {
        const prizes = await this.prisma.pREMIOS.findMany({ where: { id_jogo: gameId } });
        let totalValue = new client_1.Prisma.Decimal(0.0);
        for (const prize of prizes) {
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
    generateShuffledNumbers(min, max) {
        const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        return numbers;
    }
};
exports.GameLogicService = GameLogicService;
exports.GameLogicService = GameLogicService = GameLogicService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_gateway_1.RealtimeGateway])
], GameLogicService);
//# sourceMappingURL=game-logic.service.js.map