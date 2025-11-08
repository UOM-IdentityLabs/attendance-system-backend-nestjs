import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateDepartmentsDto } from './dto/create-departments.dto';
import { Departments } from './entities/departments.entity';
import { UpdateDepartmentsDto } from './dto/update-departments.dto';
import { GetDepartmentsDto } from './dto/get-departments.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';
import { Colleges } from 'src/colleges/entities/colleges.entity';

@Injectable()
export class DepartmentsRepository
  implements
    IRepository<
      Departments,
      CreateDepartmentsDto,
      GetDepartmentsDto,
      UpdateDepartmentsDto
    >
{
  constructor(
    @InjectRepository(Departments)
    private department: Repository<Departments>,
    @InjectRepository(Colleges)
    private college: Repository<Colleges>,
  ) {}

  async create(createDto: CreateDepartmentsDto): Promise<Departments> {
    const { departmentName, collegeId } = createDto;

    const newDepartment = new Departments();
    const newCollege = new Colleges();

    newCollege.id = collegeId;
    newDepartment.departmentName = departmentName;
    newDepartment.college = newCollege;

    try {
      return await this.department.save(newDepartment);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('department already exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetDepartmentsDto) {
    const { search, limit, offset } = query;

    const [departments, total] = await this.department.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: { departmentName: search ? ILike(`%${search}%`) : undefined },
    });

    return { departments, total };
  }

  async getById(id: string, query: GetDepartmentsDto): Promise<Departments> {
    const foundDepartment = await this.department.findOne({ where: { id } });

    if (!foundDepartment) throw new NotFoundException('no department found');

    return foundDepartment;
  }

  async update(
    id: string,
    updateDto: UpdateDepartmentsDto,
  ): Promise<Departments> {
    const foundDepartment = await this.getById(id, {});

    const { departmentName, collegeId } = updateDto;
    const newCollege = new Colleges();

    newCollege.id = collegeId;
    foundDepartment.departmentName =
      departmentName ?? foundDepartment.departmentName;
    foundDepartment.college = newCollege ?? foundDepartment.college;

    try {
      return await this.department.save(foundDepartment);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('department does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.department.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('no department deleted');

    return deleted;
  }
}
