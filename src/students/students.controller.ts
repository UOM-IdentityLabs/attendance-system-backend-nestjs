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
import { StudentsService } from './students.service';
import { CreateStudentsDto } from './dto/create-students.dto';
import { GetStudentsDto } from './dto/get-students.dto';
import { UpdateStudentsDto } from './dto/update-students.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';

@Controller('students')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() createDto: CreateStudentsDto, @Req() req) {
    return this.studentsService.create(createDto, req.user);
  }

  @Get('count')
  getCountAllStudents() {
    return this.studentsService.getCountAllStudents();
  }

  @Get()
  getAll(@Query() query: GetStudentsDto, @Req() req) {
    return this.studentsService.getAll(query, req.user);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetStudentsDto) {
    return this.studentsService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateStudentsDto) {
    return this.studentsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.studentsService.delete(id);
  }
}
