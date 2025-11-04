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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../shared/prisma/prisma.service");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, usersService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async login(loginDto) {
        const user = await this.prisma.uSUARIO.findUnique({
            where: { email: loginDto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas.');
        }
        const isPasswordMatching = await bcrypt.compare(loginDto.senha, user.senha);
        if (!isPasswordMatching) {
            throw new common_1.UnauthorizedException('Credenciais inválidas.');
        }
        const payload = {
            sub: user.id_usuario,
            email: user.email,
            isAdmin: user.is_admin,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(createUserDto) {
        return this.usersService.create(createUserDto, false);
    }
    async getUserFromToken(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Usuário do token não encontrado.');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map