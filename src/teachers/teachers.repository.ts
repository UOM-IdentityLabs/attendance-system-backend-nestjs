import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateTeachersDto } from './dto/create-teachers.dto';
import { Teachers } from './entities/teachers.entity';
import { UpdateTeachersDto } from './dto/update-teachers.dto';
import { GetTeachersDto } from './dto/get-teachers.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';
import { Departments } from 'src/departments/entities/departments.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class TeachersRepository
  implements
    IRepository<Teachers, CreateTeachersDto, GetTeachersDto, UpdateTeachersDto>
{
  constructor(
    @InjectRepository(Teachers)
    private teacher: Repository<Teachers>,
    @InjectRepository(Departments)
    private department: Repository<Departments>,
    @InjectRepository(Persons)
    private person: Repository<Persons>,
    @InjectRepository(Users)
    private user: Repository<Users>,
  ) {}

  async create(createDto: CreateTeachersDto): Promise<Teachers> {
    const { personId, userId, specialization, departmentId } = createDto;

    const newTeacher = new Teachers();
    const newPerson = new Persons();
    const newUser = new Users();
    const newDepartment = new Departments();

    newPerson.id = personId;
    newUser.id = userId;
    newDepartment.id = departmentId;

    newTeacher.person = newPerson;
    newTeacher.user = newUser;
    newTeacher.specialization = specialization;
    newTeacher.department = newDepartment;

    try {
      return await this.teacher.save(newTeacher);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');
      if (error.code === '23505')
        throw new ConflictException('Teacher already exists');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetTeachersDto) {
    const { search, limit, offset } = query;

    const [teachers, total] = await this.teacher.findAndCount({
      where: search ? [{ specialization: ILike(`%${search}%`) }] : {},
      relations: ['person', 'user', 'department'],
      take: limit,
      skip: offset,
    });

    return { teachers, total };
  }

  async getById(id: string, query: GetTeachersDto): Promise<Teachers> {
    const foundTeacher = await this.teacher.findOne({
      where: { id },
      relations: ['person', 'user', 'department'],
    });

    if (!foundTeacher) throw new NotFoundException('No teacher found');

    return foundTeacher;
  }

  async update(id: string, updateDto: UpdateTeachersDto): Promise<Teachers> {
    const foundTeacher = await this.getById(id, {});

    const { personId, userId, specialization, departmentId } = updateDto;

    if (personId) {
      const newPerson = new Persons();
      newPerson.id = personId;
      foundTeacher.person = newPerson;
    }

    if (userId) {
      const newUser = new Users();
      newUser.id = userId;
      foundTeacher.user = newUser;
    }

    if (specialization) {
      foundTeacher.specialization = specialization;
    }

    if (departmentId) {
      const newDepartment = new Departments();
      newDepartment.id = departmentId;
      foundTeacher.department = newDepartment;
    }

    try {
      return await this.teacher.save(foundTeacher);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');
      if (error.code === '23505')
        throw new ConflictException('Teacher already exists');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.teacher.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('No teacher deleted');

    return deleted;
  }
}
