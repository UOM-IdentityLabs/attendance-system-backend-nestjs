import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoursesDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  courseName: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  semester: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  collegeYearId: string;
}
