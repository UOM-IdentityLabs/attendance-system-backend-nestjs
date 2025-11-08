import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentsDto } from './create-departments.dto';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDepartmentsDto extends PartialType(CreateDepartmentsDto) {
  @IsString()
  @Type(() => String)
  collegeId: string;
}
