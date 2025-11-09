import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CollegeYearsService } from './college-years.service';
import { CreateCollegeYearsDto } from './dto/create-college-years.dto';
import { GetCollegeYearsDto } from './dto/get-college-years.dto';
import { UpdateCollegeYearsDto } from './dto/update-college-years.dto';

@Controller('college-years')
export class CollegeYearsController {
  constructor(private readonly collegeYearsService: CollegeYearsService) {}

  @Post()
  create(@Body() createDto: CreateCollegeYearsDto) {
    return this.collegeYearsService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetCollegeYearsDto) {
    return this.collegeYearsService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetCollegeYearsDto) {
    return this.collegeYearsService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCollegeYearsDto) {
    return this.collegeYearsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.collegeYearsService.delete(id);
  }
}
