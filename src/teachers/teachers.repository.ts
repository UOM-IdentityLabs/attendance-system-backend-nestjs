import {
  BadRequestException,
  ConflictException,
  HttpException,
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
import { Repository, DeleteResult, ILike, DataSource } from 'typeorm';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';
import { Bcrypt } from 'src/common/classes/bcrypt.class';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';

@Injectable()
export class TeachersRepository
  implements
    IRepository<Teachers, CreateTeachersDto, GetTeachersDto, UpdateTeachersDto>
{
  constructor(
    @InjectRepository(Teachers)
    private teacher: Repository<Teachers>,
    private bcrypt: Bcrypt,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateTeachersDto, userReq: any): Promise<Teachers> {
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
        role: UserRoleEnum.TEACHER,
      });
      const savedUser = await queryRunner.manager.save(userData);

      const teacherData = queryRunner.manager.create(Teachers, {
        person: savedPerson,
        user: savedUser,
        specialization: createDto.specialization,
        department: { id: userReq.departmentId },
      });
      const savedTeacher = await queryRunner.manager.save(teacherData);

      await queryRunner.commitTransaction();

      return savedTeacher;
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

  async getAll(query: GetTeachersDto, userReq: any) {
    const { search, limit, offset } = query;

    const queryBuilder = this.teacher
      .createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.person', 'person')
      .leftJoin('teacher.user', 'user')
      .addSelect(['user.email', 'user.role'])
      .leftJoinAndSelect('teacher.department', 'department')
      .leftJoinAndSelect('teacher.teacherCourses', 'teacherCourses')
      .leftJoinAndSelect('teacherCourses.course', 'course')
      .where('department.id = :departmentId', {
        departmentId: userReq.departmentId,
      });

    if (search) {
      queryBuilder.andWhere(
        '(person.firstName ILIKE :search OR person.secondName ILIKE :search OR person.thirdName ILIKE :search OR person.fourthName ILIKE :search OR teacher.specialization ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [teachers, total] = await queryBuilder
      .take(limit ?? 100)
      .skip(offset ?? 0)
      .getManyAndCount();

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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundTeacher = await queryRunner.manager.findOne(Teachers, {
        where: { id },
        relations: ['person', 'user', 'department'],
      });

      if (!foundTeacher) {
        throw new NotFoundException('No teacher found');
      }

      const {
        specialization,
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

      if (email && email !== foundTeacher.user.email) {
        const existingUser = await queryRunner.manager.findOne(Users, {
          where: { email },
        });
        if (existingUser && existingUser.id !== foundTeacher.user.id) {
          throw new ConflictException('Email already exists');
        }
      }

      foundTeacher.specialization =
        specialization ?? foundTeacher.specialization;

      foundTeacher.person.firstName =
        firstName ?? foundTeacher.person.firstName;
      foundTeacher.person.secondName =
        secondName ?? foundTeacher.person.secondName;
      foundTeacher.person.thirdName =
        thirdName ?? foundTeacher.person.thirdName;
      foundTeacher.person.fourthName =
        fourthName ?? foundTeacher.person.fourthName;
      foundTeacher.person.phone = phone ?? foundTeacher.person.phone;
      foundTeacher.person.image = image ?? foundTeacher.person.image;
      foundTeacher.person.birthDate =
        birthDate ?? foundTeacher.person.birthDate;

      foundTeacher.user.email = email ?? foundTeacher.user.email;
      if (password) {
        foundTeacher.user.password =
          await this.bcrypt.hashUserPassword(password);
      }

      await queryRunner.manager.save(Persons, foundTeacher.person);
      await queryRunner.manager.save(Users, foundTeacher.user);
      const savedTeacher = await queryRunner.manager.save(
        Teachers,
        foundTeacher,
      );

      await queryRunner.commitTransaction();
      return savedTeacher;
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
        `Failed to update teacher: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.teacher.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('No teacher deleted');

    return deleted;
  }
}
