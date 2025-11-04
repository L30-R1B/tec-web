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
exports.CreateUserDto = void 0;
// path: src/users/dto/create-user.dto.ts
var class_validator_1 = require("class-validator");
var CreateUserDto = function () {
    var _a;
    var _nome_decorators;
    var _nome_initializers = [];
    var _nome_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _senha_decorators;
    var _senha_initializers = [];
    var _senha_extraInitializers = [];
    var _is_admin_decorators;
    var _is_admin_initializers = [];
    var _is_admin_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateUserDto() {
                this.nome = __runInitializers(this, _nome_initializers, void 0);
                this.email = (__runInitializers(this, _nome_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.senha = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _senha_initializers, void 0));
                this.is_admin = (__runInitializers(this, _senha_extraInitializers), __runInitializers(this, _is_admin_initializers, false));
                __runInitializers(this, _is_admin_extraInitializers);
            }
            return CreateUserDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nome_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'O nome não pode ser vazio.' })];
            _email_decorators = [(0, class_validator_1.IsEmail)({}, { message: 'O e-mail fornecido é inválido.' }), (0, class_validator_1.IsNotEmpty)({ message: 'O e-mail não pode ser vazio.' })];
            _senha_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'A senha não pode ser vazia.' }), (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })];
            _is_admin_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _nome_decorators, { kind: "field", name: "nome", static: false, private: false, access: { has: function (obj) { return "nome" in obj; }, get: function (obj) { return obj.nome; }, set: function (obj, value) { obj.nome = value; } }, metadata: _metadata }, _nome_initializers, _nome_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _senha_decorators, { kind: "field", name: "senha", static: false, private: false, access: { has: function (obj) { return "senha" in obj; }, get: function (obj) { return obj.senha; }, set: function (obj, value) { obj.senha = value; } }, metadata: _metadata }, _senha_initializers, _senha_extraInitializers);
            __esDecorate(null, null, _is_admin_decorators, { kind: "field", name: "is_admin", static: false, private: false, access: { has: function (obj) { return "is_admin" in obj; }, get: function (obj) { return obj.is_admin; }, set: function (obj, value) { obj.is_admin = value; } }, metadata: _metadata }, _is_admin_initializers, _is_admin_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateUserDto = CreateUserDto;
