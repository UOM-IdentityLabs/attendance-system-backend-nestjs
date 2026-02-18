import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { AttendanceRepository } from './attendance.repository';
import { Departments } from 'src/departments/entities/departments.entity';
import { Students } from 'src/students/entities/students.entity';
import { TeacherCourses } from 'src/teacher-courses/entities/teacher-courses.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Attendance,
      Departments,
      Students,
      TeacherCourses,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepository],
})
export class AttendanceModule {}
