import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateTeacherCoursesDto } from './dto/update-teacher-courses.dto';
import { GetTeacherCoursesDto } from './dto/get-teacher-courses.dto';
import { CreateTeacherCoursesDto } from './dto/create-teacher-courses.dto';
import { TeacherCourses } from './entities/teacher-courses.entity';
import { TeacherCoursesRepository } from './teacher-courses.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TeacherCoursesService
  implements
    IRepository<
      TeacherCourses,
      CreateTeacherCoursesDto,
      GetTeacherCoursesDto,
      UpdateTeacherCoursesDto
    >
{
  constructor(private readonly teacherCoursesRepo: TeacherCoursesRepository) {}

  create(createDto: CreateTeacherCoursesDto): Promise<TeacherCourses> {
    return this.teacherCoursesRepo.create(createDto);
  }

  getAll(query: GetTeacherCoursesDto) {
    return this.teacherCoursesRepo.getAll(query);
  }

  getById(id: string, query: GetTeacherCoursesDto): Promise<TeacherCourses> {
    return this.teacherCoursesRepo.getById(id, query);
  }

  update(
    id: string,
    updateDto: UpdateTeacherCoursesDto,
  ): Promise<TeacherCourses> {
    return this.teacherCoursesRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.teacherCoursesRepo.delete(id);
  }
}
