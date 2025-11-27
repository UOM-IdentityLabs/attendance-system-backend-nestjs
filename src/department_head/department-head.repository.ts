import {
  BadRequestException,
  ConflictException,
  HttpException,
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
import { Repository, DeleteResult, ILike, DataSource } from 'typeorm';
import { Departments } from 'src/departments/entities/departments.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';
import { Bcrypt } from 'src/common/classes/bcrypt.class';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';

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
    private bcrypt: Bcrypt,
    private dataSource: DataSource,
  ) {}

  async create(
    createDto: CreateDepartmentHeadDto,
    userReq: any,
  ): Promise<DepartmentHead> {
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
        role: UserRoleEnum.DEPARTMENT_HEAD,
      });
      const savedUser = await queryRunner.manager.save(userData);

      const departmentHeadData = queryRunner.manager.create(DepartmentHead, {
        person: savedPerson,
        user: savedUser,
        department: { id: userReq.departmentId },
      });
      const savedDepartmentHead =
        await queryRunner.manager.save(departmentHeadData);

      await queryRunner.commitTransaction();

      return savedDepartmentHead;
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
        `Failed to create department head: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getAll(query: GetDepartmentHeadDto, userReq: any) {
    const { search, limit, offset } = query;

    const queryBuilder = this.departmentHead
      .createQueryBuilder('departmentHead')
      .leftJoinAndSelect('departmentHead.person', 'person')
      .leftJoinAndSelect('departmentHead.user', 'user')
      .leftJoinAndSelect('departmentHead.department', 'department')
      .where('departmentHead.departmentId = :departmentId', {
        departmentId: userReq.departmentId,
      });

    if (search) {
      queryBuilder.andWhere(
        '(person.firstName ILIKE :search OR person.secondName ILIKE :search OR person.thirdName ILIKE :search OR person.fourthName ILIKE :search) AND departmentHead.departmentId = :departmentId',
        { search: `%${search}%`, departmentId: userReq.departmentId },
      );
    }

    const [departmentHeads, total] = await queryBuilder
      .take(limit ?? 100)
      .skip(offset ?? 0)
      .getManyAndCount();

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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const foundDepartmentHead = await queryRunner.manager.findOne(
        DepartmentHead,
        {
          where: { id },
          relations: ['person', 'user', 'department'],
        },
      );

      if (!foundDepartmentHead) {
        throw new NotFoundException('No department head found');
      }

      const {
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

      if (email && email !== foundDepartmentHead.user.email) {
        const existingUser = await queryRunner.manager.findOne(Users, {
          where: { email },
        });
        if (existingUser && existingUser.id !== foundDepartmentHead.user.id) {
          throw new ConflictException('Email already exists');
        }
      }

      foundDepartmentHead.person.firstName =
        firstName ?? foundDepartmentHead.person.firstName;
      foundDepartmentHead.person.secondName =
        secondName ?? foundDepartmentHead.person.secondName;
      foundDepartmentHead.person.thirdName =
        thirdName ?? foundDepartmentHead.person.thirdName;
      foundDepartmentHead.person.fourthName =
        fourthName ?? foundDepartmentHead.person.fourthName;
      foundDepartmentHead.person.phone =
        phone ?? foundDepartmentHead.person.phone;
      foundDepartmentHead.person.image =
        image ?? foundDepartmentHead.person.image;
      foundDepartmentHead.person.birthDate =
        birthDate ?? foundDepartmentHead.person.birthDate;

      foundDepartmentHead.user.email = email ?? foundDepartmentHead.user.email;
      if (password) {
        foundDepartmentHead.user.password =
          await this.bcrypt.hashUserPassword(password);
      }

      await queryRunner.manager.save(Persons, foundDepartmentHead.person);
      await queryRunner.manager.save(Users, foundDepartmentHead.user);
      const savedDepartmentHead = await queryRunner.manager.save(
        DepartmentHead,
        foundDepartmentHead,
      );

      await queryRunner.commitTransaction();
      return savedDepartmentHead;
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
        `Failed to update department head: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.departmentHead.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('No department head deleted');

    return deleted;
  }
}
