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
import { DepartmentHeadService } from './department-head.service';
import { CreateDepartmentHeadDto } from './dto/create-department-head.dto';
import { GetDepartmentHeadDto } from './dto/get-department-head.dto';
import { UpdateDepartmentHeadDto } from './dto/update-department-head.dto';

@Controller('department-head')
export class DepartmentHeadController {
  constructor(private readonly departmentHeadService: DepartmentHeadService) {}

  @Post()
  create(@Body() createDto: CreateDepartmentHeadDto, @Req() req: any) {
    return this.departmentHeadService.create(createDto, req.user);
  }

  @Get()
  getAll(@Query() query: GetDepartmentHeadDto, @Req() req: any) {
    return this.departmentHeadService.getAll(query, req.user);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetDepartmentHeadDto) {
    return this.departmentHeadService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDepartmentHeadDto) {
    return this.departmentHeadService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.departmentHeadService.delete(id);
  }
}
