import { User } from '../../users.service';
export const userStub = (): User => {
  return {
    _id: '1',
    email: 'a@a.com',
    password: '123',
    refreshToken: '123',
    firstName: 'a',
    lastName: 'a',
  };
};
