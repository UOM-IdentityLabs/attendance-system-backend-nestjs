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
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('teachers')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  create(@Body() createDto: CreateTeachersDto, @Req() req: any) {
    return this.teachersService.create(createDto, req.user);
  }

  @Get('count')
  getCountAllTeachers() {
    return this.teachersService.getCountAllTeachers();
  }

  @Get()
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
