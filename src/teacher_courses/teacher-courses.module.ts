import { Module } from '@nestjs/common';
import { TeacherCoursesController } from './teacher-courses.controller';
import { TeacherCoursesService } from './teacher-courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherCourses } from './entities/teacher-courses.entity';
import { TeacherCoursesRepository } from './teacher-courses.repository';
import { Courses } from 'src/courses/entities/courses.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherCourses, Courses, Teachers])],
  controllers: [TeacherCoursesController],
  providers: [TeacherCoursesService, TeacherCoursesRepository],
})
export class TeacherCoursesModule {}
