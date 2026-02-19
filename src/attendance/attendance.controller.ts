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
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() createDto: CreateAttendanceDto, @Req() req) {
    return this.attendanceService.create(createDto, req);
  }

  @Get()
  getAll(@Query() query: GetAttendanceDto, @Req() req) {
    return this.attendanceService.getAll(query, req);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getMyAttendance(@Req() req, @Query() query: GetAttendanceDto) {
    return this.attendanceService.getMyAttendance(req, query);
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
