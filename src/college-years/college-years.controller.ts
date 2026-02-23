import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CollegeYearsService } from './college-years.service';
import { CreateCollegeYearsDto } from './dto/create-college-years.dto';
import { GetCollegeYearsDto } from './dto/get-college-years.dto';
import { UpdateCollegeYearsDto } from './dto/update-college-years.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('college-years')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.SUPER, UserRoleEnum.DEPARTMENT_HEAD)
export class CollegeYearsController {
  constructor(private readonly collegeYearsService: CollegeYearsService) {}

  @Post()
  create(@Body() createDto: CreateCollegeYearsDto) {
    return this.collegeYearsService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetCollegeYearsDto) {
    return this.collegeYearsService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetCollegeYearsDto) {
    return this.collegeYearsService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateCollegeYearsDto) {
    return this.collegeYearsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.collegeYearsService.delete(id);
  }
}
