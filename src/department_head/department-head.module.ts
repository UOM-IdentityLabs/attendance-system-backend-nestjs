import { Module } from '@nestjs/common';
import { DepartmentHeadController } from './department-head.controller';
import { DepartmentHeadService } from './department-head.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentHead } from './entities/department-head.entity';
import { DepartmentHeadRepository } from './department-head.repository';
import { Departments } from 'src/departments/entities/departments.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DepartmentHead, Departments, Persons, Users]),
  ],
  controllers: [DepartmentHeadController],
  providers: [DepartmentHeadService, DepartmentHeadRepository],
})
export class DepartmentHeadModule {}
