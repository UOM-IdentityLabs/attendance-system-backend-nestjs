import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  attendanceDate: Date;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  status: string;

  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  teacherCourseId: string;
}
