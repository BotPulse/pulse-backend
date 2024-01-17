import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.service';
import * as bcrypt from 'bcrypt';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  async createUser(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const result = await this.usersService.createUser({
      email,
      password: hashedPassword,
    });
    return result;
    //return this.usersService.createUser({ email, password });
  }
}
