import { Module } from '@nestjs/common';
import { CollegeYearsController } from './college-years.controller';
import { CollegeYearsService } from './college-years.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollegeYears } from './entities/college-years.entity';
import { CollegeYearsRepository } from './college-years.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CollegeYears])],
  controllers: [CollegeYearsController],
  providers: [CollegeYearsService, CollegeYearsRepository],
})
export class CollegeYearsModule {}
