import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateStudentsDto } from './dto/create-students.dto';
import { Bcrypt } from 'src/common/classes/bcrypt.class';
import { Students } from './entities/students.entity';
import { UpdateStudentsDto } from './dto/update-students.dto';
import { GetStudentsDto } from './dto/get-students.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, DataSource } from 'typeorm';
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
    private bcrypt: Bcrypt,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateStudentsDto, userReq: any): Promise<Students> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingUser = await queryRunner.manager.findOne(Users, {
        where: { email: createDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const person = queryRunner.manager.create(Persons, {
        firstName: createDto.firstName,
        secondName: createDto.secondName,
        thirdName: createDto.thirdName,
        fourthName: createDto.fourthName,
        birthDate: createDto.birthDate,
        phone: createDto.phone,
        image: createDto.image,
      });
      const savedPerson = await queryRunner.manager.save(person);

      const hashedPassword = await this.bcrypt.hashUserPassword(
        createDto.password,
      );
      const userData = queryRunner.manager.create(Users, {
        email: createDto.email,
        password: hashedPassword,
        role: 'student',
      });
      const savedUser = await queryRunner.manager.save(userData);

      const studentData = queryRunner.manager.create(Students, {
        person: savedPerson,
        user: savedUser,
        group: { id: createDto.groupId },
        department: { id: userReq.departmentId },
        collegeYear: { id: createDto.collegeYearId },
      });
      const savedStudent = await queryRunner.manager.save(studentData);

      await queryRunner.commitTransaction();

      return savedStudent;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === '23505') {
        throw new ConflictException('Email or phone number already exists');
      }
      if (error.code === '23503') {
        throw new BadRequestException('Referenced entity does not exist');
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to create student: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getAll(query: GetStudentsDto, userReq: any) {
    const { search, limit, offset } = query;

    const queryBuilder = this.student
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.person', 'person')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.group', 'group')
      .leftJoinAndSelect('student.department', 'department')
      .leftJoinAndSelect('student.collegeYear', 'collegeYear')
      .where('department.id = :departmentId', {
        departmentId: userReq.departmentId,
      });

    if (search) {
      queryBuilder.andWhere(
        '(person.firstName ILIKE :search OR person.secondName ILIKE :search OR person.thirdName ILIKE :search OR person.fourthName ILIKE :search) AND student.departmentId = :departmentId',
        { search: `%${search}%`, departmentId: userReq.departmentId },
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundStudent = await queryRunner.manager.findOne(Students, {
        where: { id },
        relations: ['person', 'user', 'group', 'department', 'collegeYear'],
      });

      if (!foundStudent) {
        throw new NotFoundException('No student found');
      }

      const {
        groupId,
        collegeYearId,
        firstName,
        secondName,
        thirdName,
        fourthName,
        email,
        password,
        phone,
        image,
        birthDate,
      } = updateDto;

      if (email && email !== foundStudent.user.email) {
        const existingUser = await queryRunner.manager.findOne(Users, {
          where: { email },
        });
        if (existingUser && existingUser.id !== foundStudent.user.id) {
          throw new ConflictException('Email already exists');
        }
      }

      if (groupId) {
        foundStudent.group = { id: groupId } as Groups;
      }

      if (collegeYearId) {
        foundStudent.collegeYear = { id: collegeYearId } as CollegeYears;
      }

      foundStudent.person.firstName =
        firstName ?? foundStudent.person.firstName;
      foundStudent.person.secondName =
        secondName ?? foundStudent.person.secondName;
      foundStudent.person.thirdName =
        thirdName ?? foundStudent.person.thirdName;
      foundStudent.person.fourthName =
        fourthName ?? foundStudent.person.fourthName;
      foundStudent.person.phone = phone ?? foundStudent.person.phone;
      foundStudent.person.image = image ?? foundStudent.person.image;
      foundStudent.person.birthDate =
        birthDate ?? foundStudent.person.birthDate;

      foundStudent.user.email = email ?? foundStudent.user.email;
      if (password) {
        foundStudent.user.password =
          await this.bcrypt.hashUserPassword(password);
      }

      await queryRunner.manager.save(Persons, foundStudent.person);
      await queryRunner.manager.save(Users, foundStudent.user);
      const savedStudent = await queryRunner.manager.save(
        Students,
        foundStudent,
      );

      await queryRunner.commitTransaction();
      return savedStudent;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error.code === '23503') {
        throw new BadRequestException('Referenced entity does not exist');
      }
      if (error.code === '23505') {
        throw new ConflictException('Email or phone number already exists');
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to update student: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.student.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('No student deleted');

    return deleted;
  }
}
