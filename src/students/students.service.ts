import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateStudentsDto } from './dto/update-students.dto';
import { GetStudentsDto } from './dto/get-students.dto';
import { CreateStudentsDto } from './dto/create-students.dto';
import { Students } from './entities/students.entity';
import { StudentsRepository } from './students.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class StudentsService
  implements
    IRepository<Students, CreateStudentsDto, GetStudentsDto, UpdateStudentsDto>
{
  constructor(private readonly studentsRepo: StudentsRepository) {}

  create(createDto: CreateStudentsDto, userReq: any): Promise<Students> {
    return this.studentsRepo.create(createDto, userReq);
  }

  getAll(query: GetStudentsDto) {
    return this.studentsRepo.getAll(query);
  }

  getById(id: string, query: GetStudentsDto): Promise<Students> {
    return this.studentsRepo.getById(id, query);
  }

  update(id: string, updateDto: UpdateStudentsDto): Promise<Students> {
    return this.studentsRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.studentsRepo.delete(id);
  }
}
