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
import { CoursesService } from './courses.service';
import { CreateCoursesDto } from './dto/create-courses.dto';
import { GetCoursesDto } from './dto/get-courses.dto';
import { UpdateCoursesDto } from './dto/update-courses.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createDto: CreateCoursesDto, @Req() req: any) {
    return this.coursesService.create(createDto, req.user);
  }

  @Get()
  @UseGuards(JwtGuard)
  getAll(@Query() query: GetCoursesDto, @Req() req: any) {
    return this.coursesService.getAll(query, req.user);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetCoursesDto) {
    return this.coursesService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCoursesDto) {
    return this.coursesService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }
}
