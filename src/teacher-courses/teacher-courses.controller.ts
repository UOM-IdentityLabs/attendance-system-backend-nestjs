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
  UseGuards,
} from '@nestjs/common';
import { TeacherCoursesService } from './teacher-courses.service';
import { CreateTeacherCoursesDto } from './dto/create-teacher-courses.dto';
import { GetTeacherCoursesDto } from './dto/get-teacher-courses.dto';
import { UpdateTeacherCoursesDto } from './dto/update-teacher-courses.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('teacher-courses')
export class TeacherCoursesController {
  constructor(private readonly teacherCoursesService: TeacherCoursesService) {}

  @Post()
  create(@Body() createDto: CreateTeacherCoursesDto) {
    return this.teacherCoursesService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetTeacherCoursesDto) {
    return this.teacherCoursesService.getAll(query);
  }

  @Get('courses')
  @UseGuards(JwtGuard)
  getTeacherCourses(@Req() req: any) {
    return this.teacherCoursesService.getTeacherCourses(req);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetTeacherCoursesDto) {
    return this.teacherCoursesService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateTeacherCoursesDto) {
    return this.teacherCoursesService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.teacherCoursesService.delete(id);
  }
}
