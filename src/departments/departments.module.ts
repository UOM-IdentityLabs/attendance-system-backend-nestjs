import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departments } from './entities/departments.entity';
import { DepartmentsRepository } from './departments.repository';
import { Colleges } from 'src/colleges/entities/colleges.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Colleges, Departments])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsRepository],
})
export class DepartmentsModule {}
