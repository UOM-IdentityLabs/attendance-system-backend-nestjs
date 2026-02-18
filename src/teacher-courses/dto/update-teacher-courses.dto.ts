import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherCoursesDto } from './create-teacher-courses.dto';

export class UpdateTeacherCoursesDto extends PartialType(
  CreateTeacherCoursesDto,
) {}
