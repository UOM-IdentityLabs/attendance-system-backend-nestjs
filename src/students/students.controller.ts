import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentsDto } from './dto/create-students.dto';
import { GetStudentsDto } from './dto/get-students.dto';
import { UpdateStudentsDto } from './dto/update-students.dto';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createDto: CreateStudentsDto, @Req() req) {
    return this.studentsService.create(createDto, req.user);
  }

  @Get()
  getAll(@Query() query: GetStudentsDto, @Req() req) {
    return this.studentsService.getAll(query, req.user);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetStudentsDto) {
    return this.studentsService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateStudentsDto) {
    return this.studentsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.studentsService.delete(id);
  }
}
