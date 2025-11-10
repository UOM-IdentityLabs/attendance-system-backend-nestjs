import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentHeadDto } from './create-department-head.dto';

export class UpdateDepartmentHeadDto extends PartialType(
  CreateDepartmentHeadDto,
) {}
