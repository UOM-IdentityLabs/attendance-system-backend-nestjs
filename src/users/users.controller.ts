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
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UserRoleEnum } from './enums/user-role.enum';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
@Roles(
  UserRoleEnum.SUPER,
  UserRoleEnum.DEPARTMENT_HEAD,
  UserRoleEnum.TEACHER,
  UserRoleEnum.STUDENT,
)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createDto: CreateUsersDto) {
    return this.usersService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetUsersDto) {
    return this.usersService.getAll(query);
  }

  @Get('me')
  getMe(@Req() req: any) {
    return this.usersService.getMe(req.user);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetUsersDto) {
    return this.usersService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: CreateUsersDto) {
    return this.usersService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
