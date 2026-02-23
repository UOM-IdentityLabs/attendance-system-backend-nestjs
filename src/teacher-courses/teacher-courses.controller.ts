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
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';

@Controller('teacher-courses')
@UseGuards(JwtGuard, RolesGuard)
export class TeacherCoursesController {
  constructor(private readonly teacherCoursesService: TeacherCoursesService) {}

  @Post()
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
  create(@Body() createDto: CreateTeacherCoursesDto) {
    return this.teacherCoursesService.create(createDto);
  }

  @Get()
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
  getAll(@Query() query: GetTeacherCoursesDto) {
    return this.teacherCoursesService.getAll(query);
  }

  @Get('courses')
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD, UserRoleEnum.TEACHER)
  getTeacherCourses(@Req() req: any) {
    return this.teacherCoursesService.getTeacherCourses(req);
  }

  @Get('student/courses')
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD, UserRoleEnum.STUDENT)
  getStudentCourses(@Req() req: any) {
    return this.teacherCoursesService.getStudentCourses(req);
  }

  @Get(':id')
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
  getById(@Param('id') id: string, @Query() query: GetTeacherCoursesDto) {
    return this.teacherCoursesService.getById(id, query);
  }

  @Patch(':id')
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
  update(@Param('id') id: string, @Body() updateDto: UpdateTeacherCoursesDto) {
    return this.teacherCoursesService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
  delete(@Param('id') id: string) {
    return this.teacherCoursesService.delete(id);
  }
}
