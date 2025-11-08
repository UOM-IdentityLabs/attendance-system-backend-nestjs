import { Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persons } from './entities/persons.entity';
import { PersonsRepository } from './perosns.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Persons])],
  controllers: [PersonsController],
  providers: [PersonsService, PersonsRepository],
})
export class PersonsModule {}
