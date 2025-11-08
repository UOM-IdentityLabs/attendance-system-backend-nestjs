import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreatePersonsDto } from './dto/create-persons.dto';
import { GetPersonsDto } from './dto/get-persons.dto';
import { UpdatePersonsDto } from './dto/updte-persons.dto';
import { Persons } from './entities/persons.entity';
import { PersonsRepository } from './perosns.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class PersonsService
  implements
    IRepository<Persons, CreatePersonsDto, GetPersonsDto, UpdatePersonsDto>
{
  constructor(private readonly personsRepository: PersonsRepository) {}

  create(createDto: CreatePersonsDto): Promise<Persons> {
    return this.personsRepository.create(createDto);
  }

  getAll(query: GetPersonsDto) {
    return this.personsRepository.getAll(query);
  }

  getById(id: string, query: GetPersonsDto): Promise<Persons> {
    return this.personsRepository.getById(id, query);
  }

  update(id: string, updateDto: UpdatePersonsDto): Promise<Persons> {
    return this.personsRepository.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.personsRepository.delete(id);
  }
}
