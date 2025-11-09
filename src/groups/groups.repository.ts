import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateGroupsDto } from './dto/create-groups.dto';
import { Groups } from './entities/groups.entity';
import { UpdateGroupsDto } from './dto/update-groups.dto';
import { GetGroupsDto } from './dto/get-groups.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';

@Injectable()
export class GroupsRepository
  implements IRepository<Groups, CreateGroupsDto, GetGroupsDto, UpdateGroupsDto>
{
  constructor(
    @InjectRepository(Groups)
    private group: Repository<Groups>,
  ) {}

  async create(createDto: CreateGroupsDto): Promise<Groups> {
    const { groupName } = createDto;

    const newGroup = new Groups();

    newGroup.groupName = groupName;

    try {
      return await this.group.save(newGroup);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('group already exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetGroupsDto) {
    const { search, limit, offset } = query;

    const [groups, total] = await this.group.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: { groupName: search ? ILike(`%${search}%`) : undefined },
    });

    return { groups, total };
  }

  async getById(id: string, query: GetGroupsDto): Promise<Groups> {
    const foundGroup = await this.group.findOne({ where: { id } });

    if (!foundGroup) throw new NotFoundException('no group found');

    return foundGroup;
  }

  async update(id: string, updateDto: UpdateGroupsDto): Promise<Groups> {
    const foundGroup = await this.getById(id, {});

    const { groupName } = updateDto;

    foundGroup.groupName = groupName ?? foundGroup.groupName;

    try {
      return await this.group.save(foundGroup);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('group does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.group.softDelete(id);

    if (deleted.affected === 0) throw new NotFoundException('no group deleted');

    return deleted;
  }
}
