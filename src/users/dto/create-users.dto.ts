import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  role: string;

  @IsEmail()
  @IsNotEmpty()
  @Type(() => String)
  email: string;
}
