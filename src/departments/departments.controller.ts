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
import { DepartmentsService } from './departments.service';
import { CreateDepartmentsDto } from './dto/create-departments.dto';
import { GetDepartmentsDto } from './dto/get-departments.dto';
import { UpdateDepartmentsDto } from './dto/update-departments.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  @Post()
  create(@Body() createDto: CreateDepartmentsDto) {
    return this.departmentService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetDepartmentsDto) {
    return this.departmentService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetDepartmentsDto) {
    return this.departmentService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDepartmentsDto) {
    return this.departmentService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.departmentService.delete(id);
  }
}
