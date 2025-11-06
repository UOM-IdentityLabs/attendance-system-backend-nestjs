import { Module } from '@nestjs/common';
import { CollegesController } from './colleges.controller';
import { CollegesService } from './colleges.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colleges } from './entities/colleges.entity';
import { CollegesRepository } from './colleges.repository';
import { Universities } from 'src/universities/entities/universities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Colleges, Universities])],
  controllers: [CollegesController],
  providers: [CollegesService, CollegesRepository],
})
export class CollegesModule {}
