import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { OffsetLimitDto } from 'src/common/dto/offset-limit.dto';

export class GetPersonsDto extends OffsetLimitDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  search?: string;
}
