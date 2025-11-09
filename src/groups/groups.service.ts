import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { UpdateGroupsDto } from './dto/update-groups.dto';
import { GetGroupsDto } from './dto/get-groups.dto';
import { CreateGroupsDto } from './dto/create-groups.dto';
import { Groups } from './entities/groups.entity';
import { GroupsRepository } from './groups.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class GroupsService
  implements IRepository<Groups, CreateGroupsDto, GetGroupsDto, UpdateGroupsDto>
{
  constructor(private readonly groupsRepo: GroupsRepository) {}

  create(createDto: CreateGroupsDto): Promise<Groups> {
    return this.groupsRepo.create(createDto);
  }

  getAll(query: GetGroupsDto) {
    return this.groupsRepo.getAll(query);
  }

  getById(id: string, query: GetGroupsDto): Promise<Groups> {
    return this.groupsRepo.getById(id, query);
  }

  update(id: string, updateDto: UpdateGroupsDto): Promise<Groups> {
    return this.groupsRepo.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.groupsRepo.delete(id);
  }
}
