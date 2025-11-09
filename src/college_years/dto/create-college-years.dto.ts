import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollegeYearsDto {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  yearName: string;
}
