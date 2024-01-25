import {
  Injectable,
  NotAcceptableException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from './secrets/jwt.constants';
import { TokenResponseDto } from './dto/token.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
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
        await this.usersService.updateRefreshToken(user._id, {
          refreshToken: await this.hashData(tokens.refreshToken),
        });
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
  async signUp(createUserDto: CreateUserDto): Promise<TokenResponseDto> {
    const userExists = await this.usersService.findOne(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser._id, newUser.email);
    await this.usersService.updateRefreshToken(newUser._id, {
      refreshToken: await this.hashData(tokens.refreshToken),
    });
    return tokens;
  }

  private async hashData(password: string): Promise<string> {
    const saltOrRounds = 10;
    const result = await bcrypt.hash(password, saltOrRounds);
    return result;
  }

  async logout(userId: string) {
    return this.usersService.deleteRefreshToken(userId);
  }

  async getTokens(userId: string, email: string): Promise<TokenResponseDto> {
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

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<TokenResponseDto> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user._id, user.email);
    await this.usersService.updateRefreshToken(user._id, {
      refreshToken: await this.hashData(tokens.refreshToken),
    });

    return tokens;
  }
}
