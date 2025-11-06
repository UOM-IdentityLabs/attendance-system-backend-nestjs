import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateCollegesDto } from './dto/update-colleges.dto';
import { GetCollegesDto } from './dto/get-colleges.dto';
import { CreateCollegesDto } from './dto/create-colleges.dto';
import { Colleges } from './entities/colleges.entity';
import { CollegesRepository } from './colleges.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class CollegesService
  implements
    IRepository<Colleges, CreateCollegesDto, GetCollegesDto, UpdateCollegesDto>
{
  constructor(private readonly collegeRepo: CollegesRepository) {}

  create(createDto: CreateCollegesDto): Promise<Colleges> {
    return this.collegeRepo.create(createDto);
  }

  getAll(query: GetCollegesDto) {
    return this.collegeRepo.getAll(query);
  }

  getById(id: string, query: GetCollegesDto): Promise<Colleges> {
    return this.collegeRepo.getById(id, query);
  }

  update(id: string, updateDto: UpdateCollegesDto): Promise<Colleges> {
    return this.collegeRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.collegeRepo.delete(id);
  }
}
