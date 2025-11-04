// path: src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.uSUARIO.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.senha,
      user.senha,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas.');
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

  async register(createUserDto: CreateUserDto) {
    // Novos registros via rota pública são sempre de usuários comuns
    return this.usersService.create(createUserDto, false);
  }

  async getUserFromToken(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      // Isso não deve acontecer se o token for válido, mas é uma boa prática de segurança
      throw new NotFoundException('Usuário do token não encontrado.');
    }
    return user;
  }
}

