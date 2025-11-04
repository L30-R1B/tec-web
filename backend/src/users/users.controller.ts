// path: src/users/users.controller.ts
import { Controller, Get, Body, Patch, Req, UseGuards, Post, Param, ParseIntPipe, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { RechargeCreditsDto } from './dto/recharge-credits.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // Rota para o próprio usuário buscar seu perfil
  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.sub);
  }

  // Rota para o próprio usuário atualizar seu perfil
  @Patch('me')
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user.sub, updateUserDto);
  }

  // Rota para o usuário recarregar créditos
  @Post('me/recharge')
  @HttpCode(HttpStatus.OK)
  rechargeCredits(
    @Req() req: AuthenticatedRequest,
    @Body() rechargeCreditsDto: RechargeCreditsDto,
  ){
     return this.usersService.rechargeCredits(req.user.sub, rechargeCreditsDto.amount);
  }
  
  // ===== ROTAS DE ADMINISTRAÇÃO =====
  
  @UseGuards(AdminGuard)
  @Post()
  createByAdmin(@Body() createUserDto: CreateUserDto) {
    // Admin pode definir se o novo usuário também será admin
    return this.usersService.create(createUserDto, createUserDto.is_admin);
  }
  
  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }
  
  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}

