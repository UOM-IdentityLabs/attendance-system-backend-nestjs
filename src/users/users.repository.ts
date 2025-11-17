import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateUsersDto } from './dto/create-users.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { Users } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Bcrypt } from 'src/common/classes/bcrypt.class';

@Injectable()
export class UsersRepository
  implements IRepository<Users, CreateUsersDto, GetUsersDto, UpdateUsersDto>
{
  constructor(
    @InjectRepository(Users) private readonly user: Repository<Users>,
    private readonly bcrypt: Bcrypt,
  ) {}

  async create(createDto: CreateUsersDto): Promise<Users> {
    const { password, role, email } = createDto;

    const newUser = new Users();

    newUser.password = await this.bcrypt.hashUserPassword(password);
    newUser.role = role;
    newUser.email = email;

    try {
      return await this.user.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetUsersDto) {
    const { limit, offset, search } = query;

    const [users, total] = await this.user.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: [{ email: search ? ILike(`%${search}%`) : undefined }],
    });

    return { users, total };
  }

  async getById(id: string, query: GetUsersDto): Promise<Users> {
    const foundUser = await this.user.findOne({ where: { id } });

    if (!foundUser) throw new NotFoundException('no user found');

    return foundUser;
  }

  async update(id: string, updateDto: UpdateUsersDto): Promise<Users> {
    const foundUser = await this.getById(id, {});

    const { password, role, email } = updateDto;

    foundUser.password = password ?? foundUser.password;
    foundUser.role = role ?? foundUser.role;
    foundUser.email = email ?? foundUser.email;

    try {
      return await this.user.save(foundUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string) {
    const deleted = await this.user.softDelete(id);

    if (deleted.affected === 0) {
      throw new NotFoundException('no user found to delete');
    }

    return deleted;
  }
}
