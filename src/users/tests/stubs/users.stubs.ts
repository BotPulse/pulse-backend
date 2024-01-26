import { UserDto } from '../../dto/user.dto';
export const userStub = (): UserDto => {
  return {
    _id: '1',
    email: 'mayer@mail.com',
    password: 'changeme',
    refreshToken: '123',
    firstName: 'a',
    lastName: 'a',
  };
};
