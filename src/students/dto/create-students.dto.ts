import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentsDto {
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
  groupId: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  departmentId: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  collegeYearId: string;
}
