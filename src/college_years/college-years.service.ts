import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateCollegeYearsDto } from './dto/update-college-years.dto';
import { GetCollegeYearsDto } from './dto/get-college-years.dto';
import { CreateCollegeYearsDto } from './dto/create-college-years.dto';
import { CollegeYears } from './entities/college-years.entity';
import { CollegeYearsRepository } from './college-years.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class CollegeYearsService
  implements
    IRepository<
      CollegeYears,
      CreateCollegeYearsDto,
      GetCollegeYearsDto,
      UpdateCollegeYearsDto
    >
{
  constructor(private readonly collegeYearsRepo: CollegeYearsRepository) {}

  create(createDto: CreateCollegeYearsDto): Promise<CollegeYears> {
    return this.collegeYearsRepo.create(createDto);
  }

  getAll(query: GetCollegeYearsDto) {
    return this.collegeYearsRepo.getAll(query);
  }

  getById(id: string, query: GetCollegeYearsDto): Promise<CollegeYears> {
    return this.collegeYearsRepo.getById(id, query);
  }

  update(id: string, updateDto: UpdateCollegeYearsDto): Promise<CollegeYears> {
    return this.collegeYearsRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.collegeYearsRepo.delete(id);
  }
}
