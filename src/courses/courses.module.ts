import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from './entities/courses.entity';
import { CoursesRepository } from './courses.repository';
import { Departments } from 'src/departments/entities/departments.entity';
import { CollegeYears } from 'src/college-years/entities/college-years.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Courses, Departments, CollegeYears])],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository],
})
export class CoursesModule {}
