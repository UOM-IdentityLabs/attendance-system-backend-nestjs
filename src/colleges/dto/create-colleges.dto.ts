import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollegesDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  collegeName: string;

  @IsString()
  @Type(() => String)
  universityId: string;
}
