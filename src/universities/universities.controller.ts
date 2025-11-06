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
import { UniversitiesService } from './universities.service';
import { CreateUniversitiesDto } from './dto/create-universities.dto';
import { GetUniversitiesDto } from './dto/get-universities.dto';
import { UpdateUniversitiesDto } from './dto/update-universities.dto';

@Controller('university')
export class UniversitiesController {
  constructor(private readonly universityService: UniversitiesService) {}

  @Post()
  create(@Body() createDto: CreateUniversitiesDto) {
    return this.universityService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetUniversitiesDto) {
    return this.universityService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetUniversitiesDto) {
    return this.universityService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateUniversitiesDto) {
    return this.universityService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.universityService.delete(id);
  }
}
