// path: src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.authService.getUserFromToken(req.user.sub);
  }
}

