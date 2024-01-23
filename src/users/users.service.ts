import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export type User = {
  email: string;
  password: string;
  refreshToken?: string;
  id?: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user') private readonly usersModel: Model<UserDocument>,
  ) {}

  async create({
    email,
    password,
    firstName,
    lastName,
  }: CreateUserDto): Promise<User> {
    return this.usersModel.create({
      email,
      password,
      firstName,
      lastName,
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.usersModel.findOne({ email });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.usersModel.findById(id);
  }
}
