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
import { UniversitiesService } from './universities.service';
import { CreateUniversitiesDto } from './dto/create-universities.dto';
import { GetUniversitiesDto } from './dto/get-universities.dto';
import { UpdateUniversitiesDto } from './dto/update-universities.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';

@Controller('universities')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.SUPER)
export class UniversitiesController {
  constructor(private readonly universityService: UniversitiesService) {}

  @Post()
  create(@Body() createDto: CreateUniversitiesDto) {
    return this.universityService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetUniversitiesDto) {
    return this.universityService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetUniversitiesDto) {
    return this.universityService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateUniversitiesDto) {
    return this.universityService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.universityService.delete(id);
  }
}
