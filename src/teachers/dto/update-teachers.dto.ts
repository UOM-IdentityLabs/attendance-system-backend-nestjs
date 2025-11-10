import { PartialType } from '@nestjs/mapped-types';
import { CreateTeachersDto } from './create-teachers.dto';

export class UpdateTeachersDto extends PartialType(CreateTeachersDto) {}
