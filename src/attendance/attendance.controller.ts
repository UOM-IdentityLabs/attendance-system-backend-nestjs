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
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  create(@Body() createDto: CreateAttendanceDto) {
    return this.attendanceService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetAttendanceDto) {
    return this.attendanceService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetAttendanceDto) {
    return this.attendanceService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.attendanceService.delete(id);
  }
}
