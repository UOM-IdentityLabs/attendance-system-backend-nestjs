import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupsDto } from './dto/create-groups.dto';
import { GetGroupsDto } from './dto/get-groups.dto';
import { UpdateGroupsDto } from './dto/update-groups.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createDto: CreateGroupsDto) {
    return this.groupsService.create(createDto);
  }

  @Get()
  getAll(@Query() query: GetGroupsDto) {
    return this.groupsService.getAll(query);
  }

  @Get(':id')
  getById(@Param('id') id: string, @Query() query: GetGroupsDto) {
    return this.groupsService.getById(id, query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateGroupsDto) {
    return this.groupsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.groupsService.delete(id);
  }
}
