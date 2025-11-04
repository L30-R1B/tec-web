// path: src/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, isAdmin: boolean) {
    const existingUser = await this.prisma.uSUARIO.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('O e-mail já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    return this.prisma.uSUARIO.create({
      data: {
        ...createUserDto,
        senha: hashedPassword,
        creditos: new Prisma.Decimal(0.0),
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

  async findById(id: number) {
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
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data: Prisma.USUARIOUpdateInput = {};

    if(updateUserDto.nome) data.nome = updateUserDto.nome;
    if(updateUserDto.email) data.email = updateUserDto.email;

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
  
  async remove(id: number) {
      await this.findById(id);
      await this.prisma.uSUARIO.delete({ where: { id_usuario: id }});
      return;
  }

  async rechargeCredits(userId: number, amount: number) {
      if (amount <= 0) {
          throw new BadRequestException("O valor da recarga deve ser positivo.");
      }
      
      const updatedUser = await this.prisma.uSUARIO.update({
          where: { id_usuario: userId },
          data: {
              creditos: {
                  increment: new Prisma.Decimal(amount)
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
      }
  }
}

