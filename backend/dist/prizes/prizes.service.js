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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrizesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../shared/prisma/prisma.service");
const client_1 = require("@prisma/client");
let PrizesService = class PrizesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createPrizeDto) {
        return this.prisma.pREMIOS.create({
            data: {
                ...createPrizeDto,
                valor: new client_1.Prisma.Decimal(createPrizeDto.valor),
            }
        });
    }
    findAll() {
        return this.prisma.pREMIOS.findMany({ include: { JOGO: true, USUARIO: { select: { nome: true } } } });
    }
    async findOne(id) {
        const prize = await this.prisma.pREMIOS.findUnique({ where: { id_premio: id } });
        if (!prize) {
            throw new common_1.NotFoundException(`Prêmio com ID ${id} não encontrado.`);
        }
        return prize;
    }
    async update(id, updatePrizeDto) {
        await this.findOne(id);
        const data = { ...updatePrizeDto };
        if (updatePrizeDto.valor) {
            data.valor = new client_1.Prisma.Decimal(updatePrizeDto.valor);
        }
        return this.prisma.pREMIOS.update({
            where: { id_premio: id },
            data,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.pREMIOS.delete({ where: { id_premio: id } });
    }
};
exports.PrizesService = PrizesService;
exports.PrizesService = PrizesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrizesService);
//# sourceMappingURL=prizes.service.js.map