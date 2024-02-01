import { TokenResponseDto } from 'src/auth/dto/token.dto';
export const tokenResponseStub = (): TokenResponseDto => ({
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
});
