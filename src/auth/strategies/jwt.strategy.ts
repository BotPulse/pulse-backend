import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../secrets/jwt.constants';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.JWT_ACCESS_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload) {
    return { userId: payload.sub, username: payload.username };
  }
}
