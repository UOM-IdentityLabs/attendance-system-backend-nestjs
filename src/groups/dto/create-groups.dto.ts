import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupsDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  groupName: string;
}
