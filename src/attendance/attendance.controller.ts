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
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';

@Controller('attendance')
@UseGuards(JwtGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.TEACHER)
  create(@Body() createDto: CreateAttendanceDto, @Req() req) {
    return this.attendanceService.create(createDto, req);
  }

  @Get()
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.TEACHER, UserRoleEnum.DEPARTMENT_HEAD)
  getAll(@Query() query: GetAttendanceDto, @Req() req) {
    return this.attendanceService.getAll(query, req);
  }

  @Get('me')
  @Roles(
    UserRoleEnum.SUPER,
    UserRoleEnum.DEPARTMENT_HEAD,
    UserRoleEnum.TEACHER,
    UserRoleEnum.STUDENT,
  )
  getMyAttendance(@Req() req, @Query() query: GetAttendanceDto) {
    return this.attendanceService.getMyAttendance(req, query);
  }

  @Get(':id')
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
  getById(@Param('id') id: string, @Query() query: GetAttendanceDto) {
    return this.attendanceService.getById(id, query);
  }

  @Patch(':id')
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
  update(@Param('id') id: string, @Body() updateDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
  delete(@Param('id') id: string) {
    return this.attendanceService.delete(id);
  }
}
