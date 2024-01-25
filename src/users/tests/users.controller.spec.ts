import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { userStub } from './stubs/users.stubs';
import { User } from '../users.service';

jest.mock('../users.service');

describe('UsersController', () => {
  let usersService: UsersService;
  let usersController: UsersController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [],
      providers: [UsersService],
    }).compile();
    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });
  describe('updateUser', () => {
    describe('When getUser is called', () => {
      let user: User;
      beforeEach(async () => {
        user = await usersController.updateUser(userStub()._id, {
          lastName: 'b',
        });
      });
      test('then it should call the service', () => {
        expect(usersService.update).toHaveBeenCalledWith(userStub()._id, {
          lastName: 'b',
        });
      });
      test('then is should return a user', () => {
        expect(user).toEqual(userStub());
      });
    });
  });
});
