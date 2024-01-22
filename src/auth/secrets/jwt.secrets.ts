import * as crypto from 'crypto';

export class JwtConstants {
  secret: string;

  constructor() {
    this.secret = this.generateRandomSecret();
  }

  private generateRandomSecret(): string {
    return crypto.randomBytes(256).toString('hex');
  }
}
