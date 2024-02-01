import { TestBed } from '@automock/jest';
import { UsersService } from '../users.service';

describe('Users Service Tests', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();
    usersService = unit;
  });
});
