import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateDepartmentsDto } from './dto/update-departments.dto';
import { GetDepartmentsDto } from './dto/get-departments.dto';
import { CreateDepartmentsDto } from './dto/create-departments.dto';
import { Departments } from './entities/departments.entity';
import { DepartmentsRepository } from './departments.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class DepartmentsService
  implements
    IRepository<
      Departments,
      CreateDepartmentsDto,
      GetDepartmentsDto,
      UpdateDepartmentsDto
    >
{
  constructor(private readonly departmentRepo: DepartmentsRepository) {}

  create(createDto: CreateDepartmentsDto): Promise<Departments> {
    return this.departmentRepo.create(createDto);
  }

  getAll(query: GetDepartmentsDto) {
    return this.departmentRepo.getAll(query);
  }

  getById(id: string, query: GetDepartmentsDto): Promise<Departments> {
    return this.departmentRepo.getById(id, query);
  }

  update(id: string, updateDto: UpdateDepartmentsDto): Promise<Departments> {
    return this.departmentRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.departmentRepo.delete(id);
  }
}
