import { PartialType } from '@nestjs/mapped-types';
import { CreateCollegesDto } from './create-colleges.dto';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCollegesDto extends PartialType(CreateCollegesDto) {
  @IsString()
  @Type(() => String)
  universityId: string;
}
