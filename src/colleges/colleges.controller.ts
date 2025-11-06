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
import { CollegesService } from './colleges.service';
import { CreateCollegesDto } from './dto/create-colleges.dto';
import { GetCollegesDto } from './dto/get-colleges.dto';
import { UpdateCollegesDto } from './dto/update-colleges.dto';

@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegeService: CollegesService) {}

  @Post()
  create(@Body() createDto: CreateCollegesDto) {
    return this.collegeService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetCollegesDto) {
    return this.collegeService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetCollegesDto) {
    return this.collegeService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCollegesDto) {
    return this.collegeService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.collegeService.delete(id);
  }
}
