import { TestBed } from '@automock/jest';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { loginStub } from './stubs/login.stub';
import { tokenResponseStub } from './stubs/token-response.stub';
import { TokenResponseDto } from '../dto/token.dto';
import { userStub } from '../../users/tests/stubs/users.stubs';
import { LoginDto } from '../dto/login.dto';
import { UserDto } from '../../users/dto/user.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('Auth Service Tests', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();
    authService = unit;
    usersService = unitRef.get<UsersService>(UsersService);
  });
  describe('Auth service validateUsers success', () => {
    let user: UserDto;
    let hashedPassword: string;
    beforeEach(async () => {
      hashedPassword = await authService.hashData(loginStub().password);
      usersService.findOne.mockResolvedValue({
        ...userStub(),
        password: hashedPassword,
      });
      user = await authService.validateUser(
        loginStub().email,
        loginStub().password,
      );
    });
    test('Then it should return a user', async () => {
      expect(user).toEqual({ ...userStub(), password: hashedPassword });
    });
  });

  describe('Auth service validateUser invalid password', () => {
    let hashedPassword: string;
    beforeEach(async () => {
      hashedPassword = await authService.hashData(loginStub().password);
      usersService.findOne.mockResolvedValue({
        ...userStub(),
        password: hashedPassword,
      });
    });
    test('Then it should return an UnauthorizedException', async () => {
      await expect(
        authService.validateUser(loginStub().email, 'invalid password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Auth service login invalid password', () => {
    describe('Login method is called', () => {
      //let loginError: UnauthorizedException | TokenResponseDto;
      let hashedPassword: string;
      beforeEach(async () => {
        hashedPassword = await authService.hashData(loginStub().password);
        usersService.findOne.mockResolvedValue({
          ...userStub(),
          password: hashedPassword,
        });
        usersService.updateRefreshToken.mockResolvedValue();
      });
      test('Then it should return an UnauthorizedException', async () => {
        await expect(
          authService.login({
            ...loginStub(),
            password: 'invalid password',
          }),
        ).rejects.toThrow(UnauthorizedException);
      });
    });
  });

  describe('Auth service login success', () => {
    describe('Login method is called', () => {
      let tokenResponse: TokenResponseDto;
      let hashedPassword: string;
      beforeEach(async () => {
        hashedPassword = await authService.hashData(loginStub().password);
        usersService.findOne.mockResolvedValue({
          ...userStub(),
          password: hashedPassword,
        });
        usersService.updateRefreshToken.mockResolvedValue();
        tokenResponse = await authService.login(loginStub());
      });
      test('Then it should return a set of JWT tokens', async () => {
        expect(tokenResponse).toEqual(tokenResponseStub());
      });
    });
  });
});
