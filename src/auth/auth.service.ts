import {
  Injectable,
  NotAcceptableException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService, User } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './secrets/jwt.constants';
import { TokenResponseDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.findOne(email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new NotAcceptableException(
          'An error occurred while validating the user',
        );
      }
    }
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);

      if (user) {
        const tokens = await this.getTokens(user._id, user.email);
        await this.updateRefreshToken(user._id, tokens.refreshToken);
        return tokens;
      }

      throw new UnauthorizedException('User not found');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new NotAcceptableException('Error during login process');
      }
    }
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const saltOrRounds = 10;
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConstants.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: jwtConstants.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }
}
