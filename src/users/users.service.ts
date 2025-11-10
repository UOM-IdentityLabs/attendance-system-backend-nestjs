import { Injectable } from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateUsersDto } from './dto/create-users.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Users } from './entities/users.entity';
import { UsersRepository } from './users.repository';
import { DeleteResult } from 'typeorm';

@Injectable()
export class UsersService
  implements IRepository<Users, CreateUsersDto, GetUsersDto, UpdateUsersDto>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  create(createDto: CreateUsersDto): Promise<Users> {
    return this.usersRepository.create(createDto);
  }

  getAll(query: GetUsersDto) {
    return this.usersRepository.getAll(query);
  }

  getById(id: string, query: GetUsersDto): Promise<Users> {
    return this.usersRepository.getById(id, query);
  }

  update(id: string, updateDto: UpdateUsersDto): Promise<Users> {
    return this.usersRepository.update(id, updateDto);
  }

  delete(id: string): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
