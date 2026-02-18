import { PartialType } from '@nestjs/mapped-types';
import { CreateCollegeYearsDto } from './create-college-years.dto';

export class UpdateCollegeYearsDto extends PartialType(CreateCollegeYearsDto) {}
