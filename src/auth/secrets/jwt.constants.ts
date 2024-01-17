import { JwtConstants } from './jwt.secrets';

const { secret } = new JwtConstants();
export const jwtConstants = {
  secret,
};
