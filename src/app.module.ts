import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './common/config/typeorm.config';
import { UniversitiesModule } from './universities/universities.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { CollegesModule } from './colleges/colleges.module';
import { DepartmentsModule } from './departments/departments.module';
import { PersonsModule } from './persons/persons.module';
import { CollegeYearsModule } from './college_years/college-years.module';
import { CoursesModule } from './courses/courses.module';
import { GroupsModule } from './groups/groups.module';
import { UsersModule } from './users/users.module';
import { DepartmentHeadModule } from './department_head/department-head.module';
import { TeachersModule } from './teachers/teachers.module';
import { StudentsModule } from './students/students.module';
import { TeacherCoursesModule } from './teacher_courses/teacher-courses.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    UniversitiesModule,
    CollegesModule,
    DepartmentsModule,
    PersonsModule,
    CollegeYearsModule,
    CoursesModule,
    GroupsModule,
    UsersModule,
    DepartmentHeadModule,
    TeachersModule,
    StudentsModule,
    TeacherCoursesModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
