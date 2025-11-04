"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
// path: src/bingo-engine/realtime/realtime.gateway.ts
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var RealtimeGateway = function () {
    var _classDecorators = [(0, websockets_1.WebSocketGateway)({
            cors: { origin: '*' }, // Em produção, restrinja para o domínio do seu frontend
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _server_decorators;
    var _server_initializers = [];
    var _server_extraInitializers = [];
    var _handleJoinGame_decorators;
    var _handleLeaveGame_decorators;
    var RealtimeGateway = _classThis = /** @class */ (function () {
        function RealtimeGateway_1() {
            this.server = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _server_initializers, void 0));
            this.logger = (__runInitializers(this, _server_extraInitializers), new common_1.Logger('RealtimeGateway'));
        }
        RealtimeGateway_1.prototype.handleConnection = function (client) {
            this.logger.log("Cliente conectado: ".concat(client.id));
        };
        RealtimeGateway_1.prototype.handleDisconnect = function (client) {
            this.logger.log("Cliente desconectado: ".concat(client.id));
        };
        RealtimeGateway_1.prototype.handleJoinGame = function (gameId, client) {
            var roomName = "game-".concat(gameId);
            client.join(roomName);
            this.logger.log("Cliente ".concat(client.id, " entrou na sala ").concat(roomName));
            client.emit('joinedGame', "Voc\u00EA est\u00E1 acompanhando o jogo ".concat(gameId));
        };
        RealtimeGateway_1.prototype.handleLeaveGame = function (gameId, client) {
            var roomName = "game-".concat(gameId);
            client.leave(roomName);
            this.logger.log("Cliente ".concat(client.id, " saiu da sala ").concat(roomName));
        };
        // Envia o número sorteado para todos na sala do jogo
        RealtimeGateway_1.prototype.broadcastNumber = function (gameId, number, order) {
            var roomName = "game-".concat(gameId);
            this.server.to(roomName).emit('numberDrawn', { number: number, order: order });
        };
        // Anuncia o vencedor e finaliza a sala
        RealtimeGateway_1.prototype.broadcastWinner = function (gameId, winnerInfo) {
            var roomName = "game-".concat(gameId);
            this.server.to(roomName).emit('gameWinner', winnerInfo);
            this.server.in(roomName).socketsLeave(roomName); // Desconecta todos da sala
        };
        // Anuncia o fim do jogo sem vencedores
        RealtimeGateway_1.prototype.broadcastEnd = function (gameId, message) {
            var roomName = "game-".concat(gameId);
            this.server.to(roomName).emit('gameEnded', { message: message });
            this.server.in(roomName).socketsLeave(roomName); // Desconecta todos da sala
        };
        return RealtimeGateway_1;
    }());
    __setFunctionName(_classThis, "RealtimeGateway");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        _handleJoinGame_decorators = [(0, websockets_1.SubscribeMessage)('joinGameRoom')];
        _handleLeaveGame_decorators = [(0, websockets_1.SubscribeMessage)('leaveGameRoom')];
        __esDecorate(_classThis, null, _handleJoinGame_decorators, { kind: "method", name: "handleJoinGame", static: false, private: false, access: { has: function (obj) { return "handleJoinGame" in obj; }, get: function (obj) { return obj.handleJoinGame; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleLeaveGame_decorators, { kind: "method", name: "handleLeaveGame", static: false, private: false, access: { has: function (obj) { return "handleLeaveGame" in obj; }, get: function (obj) { return obj.handleLeaveGame; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: function (obj) { return "server" in obj; }, get: function (obj) { return obj.server; }, set: function (obj, value) { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RealtimeGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RealtimeGateway = _classThis;
}();
exports.RealtimeGateway = RealtimeGateway;
