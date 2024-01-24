import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post('/signup')
  // async createUser(@Body() user: CreateUserDto): Promise<any> {
  //   const { email, password, firstName, lastName } = user;
  //   const saltOrRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password, saltOrRounds);
  //   const result = await this.usersService.create({
  //     email,
  //     password: hashedPassword,
  //     firstName,
  //     lastName,
  //   });
  //   return result;
  // }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
