import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teachers } from './entities/teachers.entity';
import { TeachersRepository } from './teachers.repository';
import { Departments } from 'src/departments/entities/departments.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';
import { Bcrypt } from 'src/common/classes/bcrypt.class';

@Module({
  imports: [TypeOrmModule.forFeature([Teachers, Departments, Persons, Users])],
  controllers: [TeachersController],
  providers: [TeachersService, TeachersRepository, Bcrypt],
})
export class TeachersModule {}
