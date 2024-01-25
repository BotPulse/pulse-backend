import { UserDto } from '../../dto/user.dto';
export const userStub = (): UserDto => {
  return {
    _id: '1',
    email: 'a@a.com',
    password: '123',
    refreshToken: '123',
    firstName: 'a',
    lastName: 'a',
  };
};
