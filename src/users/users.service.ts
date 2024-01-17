import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/users.schema';
export type User = {
  email: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly usersModel: Model<UserDocument>,
  ) {}

  async createUser({ email, password }: User): Promise<User> {
    return this.usersModel.create({
      email,
      password,
    });
  }
  async findOne(email: string): Promise<User | undefined> {
    return this.usersModel.findOne({ email });
  }
}
