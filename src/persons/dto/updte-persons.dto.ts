import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonsDto } from './create-persons.dto';

export class UpdatePersonsDto extends PartialType(CreatePersonsDto) {}
