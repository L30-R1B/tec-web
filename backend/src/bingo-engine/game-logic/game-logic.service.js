"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameLogicService = void 0;
// path: src/bingo-engine/game-logic/game-logic.service.ts
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var GameLogicService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GameLogicService = _classThis = /** @class */ (function () {
        function GameLogicService_1(prisma, gateway) {
            this.prisma = prisma;
            this.gateway = gateway;
            this.logger = new common_1.Logger(GameLogicService.name);
            this.activeGames = new Map();
        }
        GameLogicService_1.prototype.startGame = function (gameId) {
            return __awaiter(this, void 0, void 0, function () {
                var game, numbersToDraw, order, drawInterval;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.activeGames.get(gameId)) {
                                this.logger.warn("Tentativa de iniciar o jogo ".concat(gameId, " que j\u00E1 est\u00E1 em andamento."));
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.prisma.jOGO.findUnique({ where: { id_jogo: gameId } })];
                        case 1:
                            game = _a.sent();
                            if (!game) {
                                this.logger.error("Jogo ".concat(gameId, " n\u00E3o encontrado para iniciar."));
                                return [2 /*return*/];
                            }
                            if (game.id_usuario_vencedor) {
                                this.logger.warn("Jogo ".concat(gameId, " j\u00E1 foi finalizado."));
                                return [2 /*return*/];
                            }
                            this.logger.log("Iniciando o jogo de bingo ID: ".concat(gameId));
                            this.activeGames.set(gameId, true);
                            numbersToDraw = this.generateShuffledNumbers(1, 75);
                            order = 1;
                            drawInterval = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                var drawnNumber, winnerCard, error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            // Para o sorteio se o jogo não estiver mais ativo (ex: servidor reiniciou)
                                            if (!this.activeGames.get(gameId)) {
                                                clearInterval(drawInterval);
                                                this.logger.log("Sorteio do jogo ".concat(gameId, " interrompido."));
                                                return [2 /*return*/];
                                            }
                                            if (!(numbersToDraw.length === 0)) return [3 /*break*/, 2];
                                            clearInterval(drawInterval);
                                            return [4 /*yield*/, this.endGame(gameId, null)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                        case 2:
                                            drawnNumber = numbersToDraw.pop();
                                            this.logger.log("Jogo ".concat(gameId, ": N\u00FAmero sorteado ").concat(drawnNumber, " (Ordem: ").concat(order, ")"));
                                            _a.label = 3;
                                        case 3:
                                            _a.trys.push([3, 8, , 9]);
                                            return [4 /*yield*/, this.prisma.nUMEROS_SORTEADOS.create({
                                                    data: { id_jogo: gameId, numero: drawnNumber, ordem_sorteio: order },
                                                })];
                                        case 4:
                                            _a.sent();
                                            this.gateway.broadcastNumber(gameId, drawnNumber, order);
                                            order++;
                                            return [4 /*yield*/, this.checkForWinner(gameId)];
                                        case 5:
                                            winnerCard = _a.sent();
                                            if (!winnerCard) return [3 /*break*/, 7];
                                            clearInterval(drawInterval);
                                            return [4 /*yield*/, this.endGame(gameId, winnerCard)];
                                        case 6:
                                            _a.sent();
                                            _a.label = 7;
                                        case 7: return [3 /*break*/, 9];
                                        case 8:
                                            error_1 = _a.sent();
                                            this.logger.error("Erro no loop do jogo ".concat(gameId, ":"), error_1);
                                            clearInterval(drawInterval);
                                            this.activeGames.delete(gameId);
                                            return [3 /*break*/, 9];
                                        case 9: return [2 /*return*/];
                                    }
                                });
                            }); }, 5000);
                            return [2 /*return*/];
                    }
                });
            });
        };
        GameLogicService_1.prototype.checkForWinner = function (gameId) {
            return __awaiter(this, void 0, void 0, function () {
                var drawnNumbersResult, drawnSet, cardsInGame, _i, cardsInGame_1, card, isWinner;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.nUMEROS_SORTEADOS.findMany({
                                where: { id_jogo: gameId },
                                select: { numero: true },
                            })];
                        case 1:
                            drawnNumbersResult = _a.sent();
                            drawnSet = new Set(drawnNumbersResult.map(function (n) { return n.numero; }));
                            if (drawnSet.size < 24)
                                return [2 /*return*/, null]; // Mínimo de números para um bingo padrão (24)
                            return [4 /*yield*/, this.prisma.cARTELA.findMany({
                                    where: { id_jogo: gameId },
                                    include: { NUMEROS_CARTELA: { select: { numero: true } } },
                                })];
                        case 2:
                            cardsInGame = _a.sent();
                            for (_i = 0, cardsInGame_1 = cardsInGame; _i < cardsInGame_1.length; _i++) {
                                card = cardsInGame_1[_i];
                                isWinner = card.NUMEROS_CARTELA.every(function (num) { return drawnSet.has(num.numero); });
                                if (isWinner)
                                    return [2 /*return*/, card];
                            }
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        GameLogicService_1.prototype.endGame = function (gameId, winningCard) {
            return __awaiter(this, void 0, void 0, function () {
                var prizeValue;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!winningCard) return [3 /*break*/, 3];
                            this.logger.log("Vencedor encontrado para o jogo ".concat(gameId, "! Cartela ID: ").concat(winningCard.id_cartela, ", Usu\u00E1rio ID: ").concat(winningCard.id_usuario));
                            return [4 /*yield*/, this.prisma.jOGO.update({
                                    where: { id_jogo: gameId },
                                    data: { id_usuario_vencedor: winningCard.id_usuario },
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.distributePrizes(gameId, winningCard.id_usuario)];
                        case 2:
                            prizeValue = _a.sent();
                            this.gateway.broadcastWinner(gameId, {
                                userId: winningCard.id_usuario,
                                cardId: winningCard.id_cartela,
                                prizeValue: prizeValue.toNumber()
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            this.logger.log("Jogo ".concat(gameId, " finalizado sem vencedores."));
                            this.gateway.broadcastEnd(gameId, "O jogo terminou sem vencedores.");
                            _a.label = 4;
                        case 4:
                            this.activeGames.delete(gameId);
                            return [2 /*return*/];
                    }
                });
            });
        };
        GameLogicService_1.prototype.distributePrizes = function (gameId, winnerId) {
            return __awaiter(this, void 0, void 0, function () {
                var prizes, totalValue, _i, prizes_1, prize;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.pREMIOS.findMany({ where: { id_jogo: gameId } })];
                        case 1:
                            prizes = _a.sent();
                            totalValue = new client_1.Prisma.Decimal(0.0);
                            for (_i = 0, prizes_1 = prizes; _i < prizes_1.length; _i++) {
                                prize = prizes_1[_i];
                                totalValue = totalValue.plus(prize.valor);
                            }
                            if (!totalValue.gt(0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.uSUARIO.update({
                                    where: { id_usuario: winnerId },
                                    data: { creditos: { increment: totalValue } }
                                })];
                        case 2:
                            _a.sent();
                            this.logger.log("Usu\u00E1rio ".concat(winnerId, " recebeu ").concat(totalValue, " em pr\u00EAmios do jogo ").concat(gameId, "."));
                            _a.label = 3;
                        case 3: return [2 /*return*/, totalValue];
                    }
                });
            });
        };
        GameLogicService_1.prototype.generateShuffledNumbers = function (min, max) {
            var _a;
            var numbers = Array.from({ length: max - min + 1 }, function (_, i) { return i + min; });
            for (var i = numbers.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                _a = [numbers[j], numbers[i]], numbers[i] = _a[0], numbers[j] = _a[1];
            }
            return numbers;
        };
        return GameLogicService_1;
    }());
    __setFunctionName(_classThis, "GameLogicService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GameLogicService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GameLogicService = _classThis;
}();
exports.GameLogicService = GameLogicService;
