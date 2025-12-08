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
import { TeachersService } from './teachers.service';
import { CreateTeachersDto } from './dto/create-teachers.dto';
import { GetTeachersDto } from './dto/get-teachers.dto';
import { UpdateTeachersDto } from './dto/update-teachers.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createDto: CreateTeachersDto, @Req() req: any) {
    return this.teachersService.create(createDto, req.user);
  }

  @Get()
  @UseGuards(JwtGuard)
  getAll(@Query() query: GetTeachersDto, @Req() req: any) {
    return this.teachersService.getAll(query, req.user);
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
