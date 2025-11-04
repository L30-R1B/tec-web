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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../shared/prisma/prisma.service");
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createRoomDto) {
        return this.prisma.sALA.create({ data: createRoomDto });
    }
    findAll() {
        return this.prisma.sALA.findMany({ orderBy: { nome: 'asc' } });
    }
    async findOne(id) {
        const room = await this.prisma.sALA.findUnique({ where: { id_sala: id } });
        if (!room) {
            throw new common_1.NotFoundException(`Sala com ID ${id} não encontrada.`);
        }
        return room;
    }
    async update(id, updateRoomDto) {
        await this.findOne(id);
        return this.prisma.sALA.update({
            where: { id_sala: id },
            data: updateRoomDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.sALA.delete({ where: { id_sala: id } });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map