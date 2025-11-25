import { IntersectionType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreatePersonsDto } from 'src/persons/dto/create-persons.dto';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';

export class CreateTeachersDto extends IntersectionType(
  OmitType(CreatePersonsDto, ['email'] as const),
  OmitType(CreateUsersDto, ['role'] as const),
) {
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  specialization: string;
}
