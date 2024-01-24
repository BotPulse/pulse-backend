import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Req,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './guards/jwt-refresh.guard';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { TokenResponseDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: TokenResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User not found or invalid password',
  })
  async login(@Body() user: LoginDto): Promise<TokenResponseDto> {
    return await this.authService.login(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth('accessToken')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @ApiBearerAuth('accessToken')
  async logout(@Req() req: Request) {
    const id = req.user['sub'];
    this.authService.logout(id);
  }
}
