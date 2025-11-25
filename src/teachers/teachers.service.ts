import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateTeachersDto } from './dto/update-teachers.dto';
import { GetTeachersDto } from './dto/get-teachers.dto';
import { CreateTeachersDto } from './dto/create-teachers.dto';
import { Teachers } from './entities/teachers.entity';
import { TeachersRepository } from './teachers.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TeachersService
  implements
    IRepository<Teachers, CreateTeachersDto, GetTeachersDto, UpdateTeachersDto>
{
  constructor(private readonly teachersRepo: TeachersRepository) {}

  create(createDto: CreateTeachersDto, userReq: any): Promise<Teachers> {
    return this.teachersRepo.create(createDto, userReq);
  }

  getAll(query: GetTeachersDto, userReq: any) {
    return this.teachersRepo.getAll(query, userReq);
  }

  getById(id: string, query: GetTeachersDto): Promise<Teachers> {
    return this.teachersRepo.getById(id, query);
  }

  update(id: string, updateDto: UpdateTeachersDto): Promise<Teachers> {
    return this.teachersRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.teachersRepo.delete(id);
  }
}
