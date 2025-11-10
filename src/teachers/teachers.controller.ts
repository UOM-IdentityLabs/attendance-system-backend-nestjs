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
import { TeachersService } from './teachers.service';
import { CreateTeachersDto } from './dto/create-teachers.dto';
import { GetTeachersDto } from './dto/get-teachers.dto';
import { UpdateTeachersDto } from './dto/update-teachers.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createDto: CreateTeachersDto) {
    return this.teachersService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetTeachersDto) {
    return this.teachersService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetTeachersDto) {
    return this.teachersService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateTeachersDto) {
    return this.teachersService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.teachersService.delete(id);
  }
}
