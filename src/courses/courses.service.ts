import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateCoursesDto } from './dto/update-courses.dto';
import { GetCoursesDto } from './dto/get-courses.dto';
import { CreateCoursesDto } from './dto/create-courses.dto';
import { Courses } from './entities/courses.entity';
import { CoursesRepository } from './courses.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class CoursesService
  implements
    IRepository<Courses, CreateCoursesDto, GetCoursesDto, UpdateCoursesDto>
{
  constructor(private readonly coursesRepo: CoursesRepository) {}

  create(createDto: CreateCoursesDto, userReq: any): Promise<Courses> {
    return this.coursesRepo.create(createDto, userReq);
  }

  getCountAllCourses(): Promise<number> {
    return this.coursesRepo.getCountAllCourses();
  }

  getAll(query: GetCoursesDto, userReq: any) {
    return this.coursesRepo.getAll(query, userReq);
  }

  getById(id: string, query: GetCoursesDto): Promise<Courses> {
    return this.coursesRepo.getById(id, query);
  }

  update(id: string, updateDto: UpdateCoursesDto): Promise<Courses> {
    return this.coursesRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.coursesRepo.delete(id);
  }
}
