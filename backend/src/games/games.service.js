"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.GamesService = void 0;
// path: src/games/games.service.ts
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var GamesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GamesService = _classThis = /** @class */ (function () {
        function GamesService_1(prisma) {
            this.prisma = prisma;
            this.CARD_NUMBERS_COUNT = 24; // Cartela 5x5 com centro livre
            this.MAX_CARDS_PER_USER = 10;
        }
        GamesService_1.prototype.buyCards = function (userId, gameId, quantity) {
            return __awaiter(this, void 0, void 0, function () {
                var game, user, totalCost, userCardsCount;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (quantity <= 0 || quantity > this.MAX_CARDS_PER_USER) {
                                throw new common_1.BadRequestException("A quantidade de cartelas deve ser entre 1 e ".concat(this.MAX_CARDS_PER_USER, "."));
                            }
                            return [4 /*yield*/, this.findOne(gameId)];
                        case 1:
                            game = _a.sent();
                            if (new Date() >= game.data_hora) {
                                throw new common_1.ForbiddenException("Não é possível comprar cartelas para um jogo que já começou ou terminou.");
                            }
                            return [4 /*yield*/, this.prisma.uSUARIO.findUnique({ where: { id_usuario: userId } })];
                        case 2:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("Usuário não encontrado.");
                            totalCost = game.preco_cartela.mul(quantity);
                            if (user.creditos.lt(totalCost)) {
                                throw new common_1.ForbiddenException("Créditos insuficientes.");
                            }
                            return [4 /*yield*/, this.prisma.cARTELA.count({ where: { id_usuario: userId, id_jogo: gameId } })];
                        case 3:
                            userCardsCount = _a.sent();
                            if ((userCardsCount + quantity) > this.MAX_CARDS_PER_USER) {
                                throw new common_1.ForbiddenException("Voc\u00EA s\u00F3 pode comprar um total de ".concat(this.MAX_CARDS_PER_USER, " cartelas para este jogo."));
                            }
                            // Usamos uma transação para garantir a atomicidade da operação
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var createdCards, _loop_1, this_1, i;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.uSUARIO.update({
                                                    where: { id_usuario: userId },
                                                    data: { creditos: { decrement: totalCost } },
                                                })];
                                            case 1:
                                                _a.sent();
                                                createdCards = [];
                                                _loop_1 = function (i) {
                                                    var newCard, cardNumbers;
                                                    return __generator(this, function (_b) {
                                                        switch (_b.label) {
                                                            case 0: return [4 /*yield*/, tx.cARTELA.create({
                                                                    data: { id_jogo: gameId, id_usuario: userId, }
                                                                })];
                                                            case 1:
                                                                newCard = _b.sent();
                                                                cardNumbers = this_1.generateCardNumbers();
                                                                return [4 /*yield*/, tx.nUMEROS_CARTELA.createMany({
                                                                        data: cardNumbers.map(function (num) { return ({ id_cartela: newCard.id_cartela, numero: num }); })
                                                                    })];
                                                            case 2:
                                                                _b.sent();
                                                                createdCards.push({ cardId: newCard.id_cartela, numbers: cardNumbers });
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                };
                                                this_1 = this;
                                                i = 0;
                                                _a.label = 2;
                                            case 2:
                                                if (!(i < quantity)) return [3 /*break*/, 5];
                                                return [5 /*yield**/, _loop_1(i)];
                                            case 3:
                                                _a.sent();
                                                _a.label = 4;
                                            case 4:
                                                i++;
                                                return [3 /*break*/, 2];
                                            case 5: return [2 /*return*/, { message: "Cartelas compradas com sucesso!", cards: createdCards }];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        GamesService_1.prototype.generateCardNumbers = function () {
            var numbers = new Set();
            // Números de 1 a 75
            while (numbers.size < this.CARD_NUMBERS_COUNT) {
                var num = Math.floor(Math.random() * 75) + 1;
                numbers.add(num);
            }
            return Array.from(numbers);
        };
        GamesService_1.prototype.create = function (createGameDto) {
            return this.prisma.jOGO.create({
                data: __assign(__assign({}, createGameDto), { preco_cartela: new client_1.Prisma.Decimal(createGameDto.preco_cartela) })
            });
        };
        GamesService_1.prototype.findAll = function () {
            return this.prisma.jOGO.findMany({
                orderBy: { data_hora: 'asc' },
                include: { SALA: { select: { nome: true } } }
            });
        };
        GamesService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var game;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.jOGO.findUnique({ where: { id_jogo: id } })];
                        case 1:
                            game = _a.sent();
                            if (!game)
                                throw new common_1.NotFoundException("Jogo com ID ".concat(id, " n\u00E3o encontrado."));
                            return [2 /*return*/, game];
                    }
                });
            });
        };
        GamesService_1.prototype.findOneWithDetails = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var game;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.jOGO.findUnique({
                                where: { id_jogo: id },
                                include: {
                                    SALA: true,
                                    NUMEROS_SORTEADOS: { orderBy: { ordem_sorteio: 'asc' } },
                                    _count: { select: { CARTELA: true } }
                                }
                            })];
                        case 1:
                            game = _a.sent();
                            if (!game)
                                throw new common_1.NotFoundException("Jogo com ID ".concat(id, " n\u00E3o encontrado."));
                            return [2 /*return*/, game];
                    }
                });
            });
        };
        GamesService_1.prototype.update = function (id, updateGameDto) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _a.sent();
                            data = __assign({}, updateGameDto);
                            if (updateGameDto.preco_cartela) {
                                data.preco_cartela = new client_1.Prisma.Decimal(updateGameDto.preco_cartela);
                            }
                            return [2 /*return*/, this.prisma.jOGO.update({
                                    where: { id_jogo: id },
                                    data: data,
                                })];
                    }
                });
            });
        };
        GamesService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var game;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOneWithDetails(id)];
                        case 1:
                            game = _a.sent();
                            if (game._count.CARTELA > 0) {
                                throw new common_1.ConflictException("Não é possível remover um jogo que já possui cartelas vendidas.");
                            }
                            return [4 /*yield*/, this.prisma.jOGO.delete({ where: { id_jogo: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return GamesService_1;
    }());
    __setFunctionName(_classThis, "GamesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GamesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GamesService = _classThis;
}();
exports.GamesService = GamesService;
