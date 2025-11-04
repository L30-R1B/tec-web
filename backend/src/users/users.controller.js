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
exports.UsersController = void 0;
// path: src/users/users.controller.ts
var common_1 = require("@nestjs/common");
var admin_guard_1 = require("../auth/guards/admin.guard");
var UsersController = function () {
    var _classDecorators = [(0, common_1.Controller)('users')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getProfile_decorators;
    var _updateProfile_decorators;
    var _rechargeCredits_decorators;
    var _createByAdmin_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _remove_decorators;
    var UsersController = _classThis = /** @class */ (function () {
        function UsersController_1(usersService) {
            this.usersService = (__runInitializers(this, _instanceExtraInitializers), usersService);
        }
        // Rota para o próprio usuário buscar seu perfil
        UsersController_1.prototype.getProfile = function (req) {
            return this.usersService.findById(req.user.sub);
        };
        // Rota para o próprio usuário atualizar seu perfil
        UsersController_1.prototype.updateProfile = function (req, updateUserDto) {
            return this.usersService.update(req.user.sub, updateUserDto);
        };
        // Rota para o usuário recarregar créditos
        UsersController_1.prototype.rechargeCredits = function (req, rechargeCreditsDto) {
            return this.usersService.rechargeCredits(req.user.sub, rechargeCreditsDto.amount);
        };
        // ===== ROTAS DE ADMINISTRAÇÃO =====
        UsersController_1.prototype.createByAdmin = function (createUserDto) {
            // Admin pode definir se o novo usuário também será admin
            return this.usersService.create(createUserDto, createUserDto.is_admin);
        };
        UsersController_1.prototype.findAll = function () {
            return this.usersService.findAll();
        };
        UsersController_1.prototype.findOne = function (id) {
            return this.usersService.findById(id);
        };
        UsersController_1.prototype.remove = function (id) {
            return this.usersService.remove(id);
        };
        return UsersController_1;
    }());
    __setFunctionName(_classThis, "UsersController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getProfile_decorators = [(0, common_1.Get)('me')];
        _updateProfile_decorators = [(0, common_1.Patch)('me')];
        _rechargeCredits_decorators = [(0, common_1.Post)('me/recharge'), (0, common_1.HttpCode)(common_1.HttpStatus.OK)];
        _createByAdmin_decorators = [(0, common_1.UseGuards)(admin_guard_1.AdminGuard), (0, common_1.Post)()];
        _findAll_decorators = [(0, common_1.UseGuards)(admin_guard_1.AdminGuard), (0, common_1.Get)()];
        _findOne_decorators = [(0, common_1.UseGuards)(admin_guard_1.AdminGuard), (0, common_1.Get)(':id')];
        _remove_decorators = [(0, common_1.UseGuards)(admin_guard_1.AdminGuard), (0, common_1.Delete)(':id'), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
        __esDecorate(_classThis, null, _getProfile_decorators, { kind: "method", name: "getProfile", static: false, private: false, access: { has: function (obj) { return "getProfile" in obj; }, get: function (obj) { return obj.getProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProfile_decorators, { kind: "method", name: "updateProfile", static: false, private: false, access: { has: function (obj) { return "updateProfile" in obj; }, get: function (obj) { return obj.updateProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rechargeCredits_decorators, { kind: "method", name: "rechargeCredits", static: false, private: false, access: { has: function (obj) { return "rechargeCredits" in obj; }, get: function (obj) { return obj.rechargeCredits; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createByAdmin_decorators, { kind: "method", name: "createByAdmin", static: false, private: false, access: { has: function (obj) { return "createByAdmin" in obj; }, get: function (obj) { return obj.createByAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersController = _classThis;
}();
exports.UsersController = UsersController;
