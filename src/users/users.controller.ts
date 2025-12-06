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

@Controller('users')
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
  @UseGuards(JwtGuard)
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
