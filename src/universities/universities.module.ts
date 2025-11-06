import { Module } from '@nestjs/common';
import { UniversitiesController } from './universities.controller';
import { UniversitiesService } from './universities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Universities } from './entities/universities.entity';
import { UniversitiesRepository } from './universities.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Universities])],
  controllers: [UniversitiesController],
  providers: [UniversitiesService, UniversitiesRepository],
})
export class UniversitiesModule {}
