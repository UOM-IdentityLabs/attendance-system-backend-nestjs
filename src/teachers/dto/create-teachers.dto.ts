import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTeachersDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  personId: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  specialization: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  departmentId: string;
}
