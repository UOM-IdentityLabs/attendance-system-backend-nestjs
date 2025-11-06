import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateUniversitiesDto } from './dto/update-universities.dto';
import { GetUniversitiesDto } from './dto/get-universities.dto';
import { CreateUniversitiesDto } from './dto/create-universities.dto';
import { Universities } from './entities/universities.entity';
import { UniversitiesRepository } from './universities.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UniversitiesService
  implements
    IRepository<
      Universities,
      CreateUniversitiesDto,
      GetUniversitiesDto,
      UpdateUniversitiesDto
    >
{
  constructor(private readonly universityRepo: UniversitiesRepository) {}

  create(createDto: CreateUniversitiesDto): Promise<Universities> {
    return this.universityRepo.create(createDto);
  }

  getAll(query: GetUniversitiesDto) {
    return this.universityRepo.getAll(query);
  }

  getById(id: string, query: GetUniversitiesDto): Promise<Universities> {
    return this.universityRepo.getById(id, query);
  }

  update(id: string, updateDto: UpdateUniversitiesDto): Promise<Universities> {
    return this.universityRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.universityRepo.delete(id);
  }
}
