import { LoginDto } from 'src/auth/dto/login.dto';

export const loginStub = (): LoginDto => ({
  email: 'mayer@mail.com',
  password: 'changeme',
});
