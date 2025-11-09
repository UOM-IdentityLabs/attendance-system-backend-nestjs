import { PartialType } from '@nestjs/mapped-types';
import { CreateCoursesDto } from './create-courses.dto';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCoursesDto extends PartialType(CreateCoursesDto) {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  departmentId: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  collegeYearId: string;
}
