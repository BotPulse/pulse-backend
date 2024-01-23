import { JwtConstants } from './jwt.secrets';

const JWT_ACCESS_SECRET = new JwtConstants();
const JWT_REFRESH_SECRET = new JwtConstants();
export const jwtConstants = {
  JWT_ACCESS_SECRET: JWT_ACCESS_SECRET.secret,
  JWT_REFRESH_SECRET: JWT_REFRESH_SECRET.secret,
};
