import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateStudentsDto } from './dto/create-students.dto';
import { Students } from './entities/students.entity';
import { UpdateStudentsDto } from './dto/update-students.dto';
import { GetStudentsDto } from './dto/get-students.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CollegeYears } from 'src/college_years/entities/college-years.entity';
import { Departments } from 'src/departments/entities/departments.entity';
import { Groups } from 'src/groups/entities/groups.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';

@Injectable()
export class StudentsRepository
  implements
    IRepository<Students, CreateStudentsDto, GetStudentsDto, UpdateStudentsDto>
{
  constructor(
    @InjectRepository(Students)
    private student: Repository<Students>,
    @InjectRepository(Persons)
    private person: Repository<Persons>,
    @InjectRepository(Users)
    private user: Repository<Users>,
    @InjectRepository(Groups)
    private group: Repository<Groups>,
    @InjectRepository(Departments)
    private department: Repository<Departments>,
    @InjectRepository(CollegeYears)
    private collegeYear: Repository<CollegeYears>,
  ) {}

  async create(createDto: CreateStudentsDto): Promise<Students> {
    const { personId, userId, groupId, departmentId, collegeYearId } =
      createDto;

    const newStudent = new Students();
    const newPerson = new Persons();
    const newUser = new Users();
    const newGroup = new Groups();
    const newDepartment = new Departments();
    const newCollegeYear = new CollegeYears();

    newPerson.id = personId;
    newUser.id = userId;
    newGroup.id = groupId;
    newDepartment.id = departmentId;
    newCollegeYear.id = collegeYearId;

    newStudent.person = newPerson;
    newStudent.user = newUser;
    newStudent.group = newGroup;
    newStudent.department = newDepartment;
    newStudent.collegeYear = newCollegeYear;

    try {
      return await this.student.save(newStudent);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');
      if (error.code === '23505')
        throw new ConflictException('Student already exists');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetStudentsDto) {
    const { search, limit, offset } = query;

    const queryBuilder = this.student
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.group', 'group')
      .leftJoinAndSelect('student.department', 'department')
      .leftJoinAndSelect('student.collegeYear', 'collegeYear');

    if (search) {
      queryBuilder.where(
        'person.firstName ILIKE :search OR person.secondName ILIKE :search OR person.thirdName ILIKE :search OR person.fourthName ILIKE :search OR department.departmentName ILIKE :search',
        { search: `%${search}%` },
      );
    }

    const [students, total] = await queryBuilder
      .take(limit ?? 100)
      .skip(offset ?? 0)
      .getManyAndCount();

    return { students, total };
  }

  async getById(id: string, query: GetStudentsDto): Promise<Students> {
    const foundStudent = await this.student.findOne({
      where: { id },
      relations: ['person', 'user', 'group', 'department', 'collegeYear'],
    });

    if (!foundStudent) throw new NotFoundException('No student found');

    return foundStudent;
  }

  async update(id: string, updateDto: UpdateStudentsDto): Promise<Students> {
    const foundStudent = await this.getById(id, {});

    const { personId, userId, groupId, departmentId, collegeYearId } =
      updateDto;

    if (personId) {
      const newPerson = new Persons();
      newPerson.id = personId;
      foundStudent.person = newPerson;
    }

    if (userId) {
      const newUser = new Users();
      newUser.id = userId;
      foundStudent.user = newUser;
    }

    if (groupId) {
      const newGroup = new Groups();
      newGroup.id = groupId;
      foundStudent.group = newGroup;
    }

    if (departmentId) {
      const newDepartment = new Departments();
      newDepartment.id = departmentId;
      foundStudent.department = newDepartment;
    }

    if (collegeYearId) {
      const newCollegeYear = new CollegeYears();
      newCollegeYear.id = collegeYearId;
      foundStudent.collegeYear = newCollegeYear;
    }

    try {
      return await this.student.save(foundStudent);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');
      if (error.code === '23505')
        throw new ConflictException('Student already exists');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.student.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('No student deleted');

    return deleted;
  }
}
