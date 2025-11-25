import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateDepartmentHeadDto } from './dto/update-department-head.dto';
import { GetDepartmentHeadDto } from './dto/get-department-head.dto';
import { CreateDepartmentHeadDto } from './dto/create-department-head.dto';
import { DepartmentHead } from './entities/department-head.entity';
import { DepartmentHeadRepository } from './department-head.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class DepartmentHeadService
  implements
    IRepository<
      DepartmentHead,
      CreateDepartmentHeadDto,
      GetDepartmentHeadDto,
      UpdateDepartmentHeadDto
    >
{
  constructor(private readonly departmentHeadRepo: DepartmentHeadRepository) {}

  create(
    createDto: CreateDepartmentHeadDto,
    userReq: any,
  ): Promise<DepartmentHead> {
    return this.departmentHeadRepo.create(createDto, userReq);
  }

  getAll(query: GetDepartmentHeadDto, userReq: any) {
    return this.departmentHeadRepo.getAll(query, userReq);
  }

  getById(id: string, query: GetDepartmentHeadDto): Promise<DepartmentHead> {
    return this.departmentHeadRepo.getById(id, query);
  }

  update(
    id: string,
    updateDto: UpdateDepartmentHeadDto,
  ): Promise<DepartmentHead> {
    return this.departmentHeadRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.departmentHeadRepo.delete(id);
  }
}
