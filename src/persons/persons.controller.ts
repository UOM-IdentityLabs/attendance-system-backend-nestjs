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
import { PersonsService } from './persons.service';
import { CreatePersonsDto } from './dto/create-persons.dto';
import { GetPersonsDto } from './dto/get-persons.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';

@Controller('persons')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRoleEnum.SUPER)
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Post()
  create(@Body() createDto: CreatePersonsDto) {
    return this.personsService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetPersonsDto) {
    return this.personsService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetPersonsDto) {
    return this.personsService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: CreatePersonsDto) {
    return this.personsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.personsService.delete(id);
  }
}
