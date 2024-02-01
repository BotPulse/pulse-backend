import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}

  async create(createUser: CreateUserDto): Promise<UserDto> {
    const user = new this.usersModel(createUser);
    return user.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    try {
      return await this.usersModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select(['-password', '-refreshToken'])
        .exec();
    } catch (error) {
      throw new BadRequestException('Error while updating user');
    }
  }

  async findOne(email: string): Promise<UserDto | undefined> {
    return await this.usersModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDto | undefined> {
    return this.usersModel.findById(id);
  }
  async updateRefreshToken(
    id: string,
    refreshToken: RefreshTokenDto,
  ): Promise<void> {
    try {
      await this.usersModel
        .findByIdAndUpdate(id, refreshToken, { new: true })
        .select(['-password', '-refreshToken'])
        .exec();
    } catch (error) {
      console.log(`updateRefreshToken error: ${error}`);
      throw new BadRequestException('Error while updating user');
    }
  }
  async deleteRefreshToken(id: string) {
    try {
      return await this.usersModel
        .updateOne({ _id: id }, { $unset: { refreshToken: 1 } })
        .select('-password')
        .exec();
    } catch (error) {
      console.log(`deleteRefreshToken error: ${error}`);
      throw new BadRequestException('Error while updating user');
    }
  }
}
