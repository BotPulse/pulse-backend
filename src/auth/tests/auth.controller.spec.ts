import { TestBed } from '@automock/jest';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { loginStub } from './stubs/login.stub';
import { tokenResponseStub } from './stubs/token-response.stub';
import { TokenResponseDto } from '../dto/token.dto';

describe('AuthController', () => {
  let authService: jest.Mocked<AuthService>;
  let authController: AuthController;
  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();
    authController = unit;
    authService = unitRef.get<AuthService>(AuthService);
  });
  describe('login', () => {
    describe('Login path is called', () => {
      let jwtTokens: TokenResponseDto;
      beforeEach(async () => {
        authService.login.mockResolvedValue(tokenResponseStub());
        jwtTokens = await authController.login(loginStub());
      });
      test('Then it should call the login service', () => {
        expect(authService.login).toHaveBeenCalledWith(loginStub());
      });
      test('Then it should return a set of JWT tokens', () => {
        expect(jwtTokens).toEqual(tokenResponseStub());
      });
    });
  });
});
