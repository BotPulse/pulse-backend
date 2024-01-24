import { IsNotEmpty, IsEmail, Length, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  @Length(6, 50, { message: 'Password length must be between 6 and 50' })
  password: string;
  @IsNotEmpty({ message: 'Please enter a valid first name' })
  @IsString({ message: 'Please enter a valid first name' })
  firstName: string;
  @IsNotEmpty({ message: 'Please enter a valid last name' })
  @IsString({ message: 'Please enter a valid last name' })
  lastName: string;
}
