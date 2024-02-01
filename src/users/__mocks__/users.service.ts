import { userStub } from '../tests/stubs/users.stubs';

export const UsersService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockReturnValue(userStub()),
  findById: jest.fn().mockReturnValue(userStub()),
  update: jest.fn().mockReturnValue(userStub()),
});
