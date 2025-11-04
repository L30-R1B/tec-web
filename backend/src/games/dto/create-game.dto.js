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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGameDto = void 0;
// path: src/games/dto/create-game.dto.ts
var class_validator_1 = require("class-validator");
var CreateGameDto = function () {
    var _a;
    var _data_hora_decorators;
    var _data_hora_initializers = [];
    var _data_hora_extraInitializers = [];
    var _id_sala_decorators;
    var _id_sala_initializers = [];
    var _id_sala_extraInitializers = [];
    var _preco_cartela_decorators;
    var _preco_cartela_initializers = [];
    var _preco_cartela_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateGameDto() {
                this.data_hora = __runInitializers(this, _data_hora_initializers, void 0);
                this.id_sala = (__runInitializers(this, _data_hora_extraInitializers), __runInitializers(this, _id_sala_initializers, void 0));
                this.preco_cartela = (__runInitializers(this, _id_sala_extraInitializers), __runInitializers(this, _preco_cartela_initializers, void 0));
                __runInitializers(this, _preco_cartela_extraInitializers);
            }
            return CreateGameDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _data_hora_decorators = [(0, class_validator_1.IsDateString)({}, { message: "A data e hora devem estar no formato ISO 8601." }), (0, class_validator_1.IsNotEmpty)({ message: "A data e hora do jogo são obrigatórias." })];
            _id_sala_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)()];
            _preco_cartela_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)({ message: "O preço da cartela deve ser um valor positivo." })];
            __esDecorate(null, null, _data_hora_decorators, { kind: "field", name: "data_hora", static: false, private: false, access: { has: function (obj) { return "data_hora" in obj; }, get: function (obj) { return obj.data_hora; }, set: function (obj, value) { obj.data_hora = value; } }, metadata: _metadata }, _data_hora_initializers, _data_hora_extraInitializers);
            __esDecorate(null, null, _id_sala_decorators, { kind: "field", name: "id_sala", static: false, private: false, access: { has: function (obj) { return "id_sala" in obj; }, get: function (obj) { return obj.id_sala; }, set: function (obj, value) { obj.id_sala = value; } }, metadata: _metadata }, _id_sala_initializers, _id_sala_extraInitializers);
            __esDecorate(null, null, _preco_cartela_decorators, { kind: "field", name: "preco_cartela", static: false, private: false, access: { has: function (obj) { return "preco_cartela" in obj; }, get: function (obj) { return obj.preco_cartela; }, set: function (obj, value) { obj.preco_cartela = value; } }, metadata: _metadata }, _preco_cartela_initializers, _preco_cartela_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateGameDto = CreateGameDto;
