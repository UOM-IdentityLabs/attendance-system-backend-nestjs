import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreatePersonsDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  secondName: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  thirdName: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  fourthName: string;

  @IsString()
  @Type(() => String)
  image?: string;

  @IsString()
  @Type(() => String)
  email?: string;

  @IsString()
  @Type(() => String)
  phone?: string;

  @IsDate()
  @Type(() => Date)
  birthDate: Date;
}
