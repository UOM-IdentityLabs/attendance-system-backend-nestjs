import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { OffsetLimitDto } from 'src/common/dto/offset-limit.dto';

export class GetPersonsDto extends OffsetLimitDto {
  @IsString()
  @Type(() => String)
  search?: string;
}
