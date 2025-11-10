import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsDateString()
  @IsNotEmpty()
  @Type(() => Date)
  attendanceDate: Date;

  @IsOptional()
  @IsString()
  @Type(() => String)
  status?: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  studentId: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  teacherCourseId: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  departmentId: string;
}
