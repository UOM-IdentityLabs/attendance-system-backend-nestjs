import { PartialType } from '@nestjs/mapped-types';
import { CreateUniversitiesDto } from './create-universities.dto';

export class UpdateUniversitiesDto extends PartialType(CreateUniversitiesDto) {}
