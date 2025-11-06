import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUniversitiesDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  universityName: string;
}
