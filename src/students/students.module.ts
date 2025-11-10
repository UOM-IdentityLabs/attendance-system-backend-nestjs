import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Students } from './entities/students.entity';
import { StudentsRepository } from './students.repository';
import { CollegeYears } from 'src/college_years/entities/college-years.entity';
import { Departments } from 'src/departments/entities/departments.entity';
import { Groups } from 'src/groups/entities/groups.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Students,
      CollegeYears,
      Departments,
      Groups,
      Persons,
      Users,
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepository],
})
export class StudentsModule {}
