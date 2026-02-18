import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTeacherCoursesDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  courseType: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  group?: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  courseId: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  teacherId: string;
}
