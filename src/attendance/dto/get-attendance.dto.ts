import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDateString } from 'class-validator';
import { OffsetLimitDto } from 'src/common/dto/offset-limit.dto';

export class GetAttendanceDto extends OffsetLimitDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  search?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  course?: string;
}
