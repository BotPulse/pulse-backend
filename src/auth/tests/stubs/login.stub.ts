import { LoginDto } from 'src/auth/dto/login.dto';

export const loginStub = (): LoginDto => ({
  email: 'gmayer@mail.com',
  password: 'changeme',
});
