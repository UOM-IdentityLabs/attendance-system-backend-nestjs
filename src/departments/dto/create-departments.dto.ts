import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentsDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  departmentName: string;

  @IsString()
  @Type(() => String)
  collegeId: string;
}
