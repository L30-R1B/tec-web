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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../shared/prisma/prisma.service");
const bcrypt = require("bcryptjs");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto, isAdmin) {
        const existingUser = await this.prisma.uSUARIO.findUnique({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('O e-mail já está em uso.');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);
        return this.prisma.uSUARIO.create({
            data: {
                ...createUserDto,
                senha: hashedPassword,
                creditos: new client_1.Prisma.Decimal(0.0),
                is_admin: isAdmin,
            },
            select: {
                id_usuario: true,
                nome: true,
                email: true,
                is_admin: true,
            },
        });
    }
    async findAll() {
        return this.prisma.uSUARIO.findMany({
            select: { id_usuario: true, nome: true, email: true, creditos: true, is_admin: true }
        });
    }
    async findById(id) {
        const user = await this.prisma.uSUARIO.findUnique({
            where: { id_usuario: id },
            select: {
                id_usuario: true,
                nome: true,
                email: true,
                creditos: true,
                is_admin: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }
        return user;
    }
    async update(id, updateUserDto) {
        const data = {};
        if (updateUserDto.nome)
            data.nome = updateUserDto.nome;
        if (updateUserDto.email)
            data.email = updateUserDto.email;
        if (updateUserDto.senha) {
            data.senha = await bcrypt.hash(updateUserDto.senha, 10);
        }
        return this.prisma.uSUARIO.update({
            where: { id_usuario: id },
            data,
            select: {
                id_usuario: true,
                nome: true,
                email: true,
            },
        });
    }
    async remove(id) {
        await this.findById(id);
        await this.prisma.uSUARIO.delete({ where: { id_usuario: id } });
        return;
    }
    async rechargeCredits(userId, amount) {
        if (amount <= 0) {
            throw new common_1.BadRequestException("O valor da recarga deve ser positivo.");
        }
        const updatedUser = await this.prisma.uSUARIO.update({
            where: { id_usuario: userId },
            data: {
                creditos: {
                    increment: new client_1.Prisma.Decimal(amount)
                }
            },
            select: {
                id_usuario: true,
                creditos: true,
                nome: true,
            }
        });
        return {
            message: `Recarga de ${amount} créditos realizada com sucesso para ${updatedUser.nome}.`,
            newBalance: updatedUser.creditos,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map