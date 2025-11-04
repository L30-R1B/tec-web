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
exports.CreatePrizeDto = void 0;
// path: src/prizes/dto/create-prize.dto.ts
var class_validator_1 = require("class-validator");
var CreatePrizeDto = function () {
    var _a;
    var _descricao_decorators;
    var _descricao_initializers = [];
    var _descricao_extraInitializers = [];
    var _valor_decorators;
    var _valor_initializers = [];
    var _valor_extraInitializers = [];
    var _id_usuario_decorators;
    var _id_usuario_initializers = [];
    var _id_usuario_extraInitializers = [];
    var _id_jogo_decorators;
    var _id_jogo_initializers = [];
    var _id_jogo_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePrizeDto() {
                this.descricao = __runInitializers(this, _descricao_initializers, void 0);
                this.valor = (__runInitializers(this, _descricao_extraInitializers), __runInitializers(this, _valor_initializers, void 0));
                this.id_usuario = (__runInitializers(this, _valor_extraInitializers), __runInitializers(this, _id_usuario_initializers, void 0)); // Geralmente, este campo seria o vencedor, que é definido no final do jogo. 
                // Pode ser removido do DTO de criação e adicionado programaticamente.
                // Mantido para seguir o esquema.
                this.id_jogo = (__runInitializers(this, _id_usuario_extraInitializers), __runInitializers(this, _id_jogo_initializers, void 0));
                __runInitializers(this, _id_jogo_extraInitializers);
            }
            return CreatePrizeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _descricao_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _valor_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)()];
            _id_usuario_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)()];
            _id_jogo_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)()];
            __esDecorate(null, null, _descricao_decorators, { kind: "field", name: "descricao", static: false, private: false, access: { has: function (obj) { return "descricao" in obj; }, get: function (obj) { return obj.descricao; }, set: function (obj, value) { obj.descricao = value; } }, metadata: _metadata }, _descricao_initializers, _descricao_extraInitializers);
            __esDecorate(null, null, _valor_decorators, { kind: "field", name: "valor", static: false, private: false, access: { has: function (obj) { return "valor" in obj; }, get: function (obj) { return obj.valor; }, set: function (obj, value) { obj.valor = value; } }, metadata: _metadata }, _valor_initializers, _valor_extraInitializers);
            __esDecorate(null, null, _id_usuario_decorators, { kind: "field", name: "id_usuario", static: false, private: false, access: { has: function (obj) { return "id_usuario" in obj; }, get: function (obj) { return obj.id_usuario; }, set: function (obj, value) { obj.id_usuario = value; } }, metadata: _metadata }, _id_usuario_initializers, _id_usuario_extraInitializers);
            __esDecorate(null, null, _id_jogo_decorators, { kind: "field", name: "id_jogo", static: false, private: false, access: { has: function (obj) { return "id_jogo" in obj; }, get: function (obj) { return obj.id_jogo; }, set: function (obj, value) { obj.id_jogo = value; } }, metadata: _metadata }, _id_jogo_initializers, _id_jogo_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePrizeDto = CreatePrizeDto;
