import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateDepartmentHeadDto } from './dto/create-department-head.dto';
import { DepartmentHead } from './entities/department-head.entity';
import { UpdateDepartmentHeadDto } from './dto/update-department-head.dto';
import { GetDepartmentHeadDto } from './dto/get-department-head.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';
import { Departments } from 'src/departments/entities/departments.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class DepartmentHeadRepository
  implements
    IRepository<
      DepartmentHead,
      CreateDepartmentHeadDto,
      GetDepartmentHeadDto,
      UpdateDepartmentHeadDto
    >
{
  constructor(
    @InjectRepository(DepartmentHead)
    private departmentHead: Repository<DepartmentHead>,
    @InjectRepository(Departments)
    private department: Repository<Departments>,
    @InjectRepository(Persons)
    private person: Repository<Persons>,
    @InjectRepository(Users)
    private user: Repository<Users>,
  ) {}

  async create(createDto: CreateDepartmentHeadDto): Promise<DepartmentHead> {
    const { personId, userId, departmentId } = createDto;

    const newDepartmentHead = new DepartmentHead();
    const newPerson = new Persons();
    const newUser = new Users();
    const newDepartment = new Departments();

    newPerson.id = personId;
    newUser.id = userId;
    newDepartment.id = departmentId;

    newDepartmentHead.person = newPerson;
    newDepartmentHead.user = newUser;
    newDepartmentHead.department = newDepartment;

    try {
      return await this.departmentHead.save(newDepartmentHead);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');
      if (error.code === '23505')
        throw new ConflictException('Department head already exists');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetDepartmentHeadDto) {
    const { search, limit, offset } = query;

    const [departmentHeads, total] = await this.departmentHead.findAndCount({
      relations: ['person', 'user', 'department'],
      take: limit ?? 100,
      skip: offset ?? 0,
    });

    return { departmentHeads, total };
  }

  async getById(
    id: string,
    query: GetDepartmentHeadDto,
  ): Promise<DepartmentHead> {
    const foundDepartmentHead = await this.departmentHead.findOne({
      where: { id },
      relations: ['person', 'user', 'department'],
    });

    if (!foundDepartmentHead)
      throw new NotFoundException('No department head found');

    return foundDepartmentHead;
  }

  async update(
    id: string,
    updateDto: UpdateDepartmentHeadDto,
  ): Promise<DepartmentHead> {
    const foundDepartmentHead = await this.getById(id, {});

    const { personId, userId, departmentId } = updateDto;

    if (personId) {
      const newPerson = new Persons();
      newPerson.id = personId;
      foundDepartmentHead.person = newPerson;
    }

    if (userId) {
      const newUser = new Users();
      newUser.id = userId;
      foundDepartmentHead.user = newUser;
    }

    if (departmentId) {
      const newDepartment = new Departments();
      newDepartment.id = departmentId;
      foundDepartmentHead.department = newDepartment;
    }

    try {
      return await this.departmentHead.save(foundDepartmentHead);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');
      if (error.code === '23505')
        throw new ConflictException('Department head already exists');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.departmentHead.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('No department head deleted');

    return deleted;
  }
}
