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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrizesController = void 0;
const common_1 = require("@nestjs/common");
const prizes_service_1 = require("./prizes.service");
const create_prize_dto_1 = require("./dto/create-prize.dto");
const update_prize_dto_1 = require("./dto/update-prize.dto");
const admin_guard_1 = require("../auth/guards/admin.guard");
let PrizesController = class PrizesController {
    constructor(prizesService) {
        this.prizesService = prizesService;
    }
    create(createPrizeDto) {
        return this.prizesService.create(createPrizeDto);
    }
    findAll() {
        return this.prizesService.findAll();
    }
    findOne(id) {
        return this.prizesService.findOne(id);
    }
    update(id, updatePrizeDto) {
        return this.prizesService.update(id, updatePrizeDto);
    }
    remove(id) {
        return this.prizesService.remove(id);
    }
};
exports.PrizesController = PrizesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_prize_dto_1.CreatePrizeDto]),
    __metadata("design:returntype", void 0)
], PrizesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PrizesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PrizesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_prize_dto_1.UpdatePrizeDto]),
    __metadata("design:returntype", void 0)
], PrizesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PrizesController.prototype, "remove", null);
exports.PrizesController = PrizesController = __decorate([
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    (0, common_1.Controller)('prizes'),
    __metadata("design:paramtypes", [prizes_service_1.PrizesService])
], PrizesController);
//# sourceMappingURL=prizes.controller.js.map