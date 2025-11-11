import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsOptional()
  @IsString()
  @Type(() => String)
  image?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  email?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  phone?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;
}
