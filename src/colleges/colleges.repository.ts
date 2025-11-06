import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateCollegesDto } from './dto/create-colleges.dto';
import { Colleges } from './entities/colleges.entity';
import { UpdateCollegesDto } from './dto/update-colleges.dto';
import { GetCollegesDto } from './dto/get-colleges.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';
import { Universities } from 'src/universities/entities/universities.entity';

@Injectable()
export class CollegesRepository
  implements
    IRepository<Colleges, CreateCollegesDto, GetCollegesDto, UpdateCollegesDto>
{
  constructor(
    @InjectRepository(Colleges)
    private college: Repository<Colleges>,
    @InjectRepository(Universities)
    private university: Repository<Universities>,
  ) {}

  async create(createDto: CreateCollegesDto): Promise<Colleges> {
    const { collegeName, universityId } = createDto;

    const newCollege = new Colleges();
    const newUniversity = new Universities();

    newUniversity.id = universityId;
    newCollege.collegeName = collegeName;
    newCollege.university = newUniversity;

    try {
      return await this.college.save(newCollege);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('college already exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetCollegesDto) {
    const { search, limit, offset } = query;

    const [colleges, total] = await this.college.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: { collegeName: search ? ILike(`%${search}%`) : undefined },
    });

    return { colleges, total };
  }

  async getById(id: string, query: GetCollegesDto): Promise<Colleges> {
    const foundCollege = await this.college.findOne({ where: { id } });

    if (!foundCollege) throw new NotFoundException('no college found');

    return foundCollege;
  }

  async update(id: string, updateDto: UpdateCollegesDto): Promise<Colleges> {
    const foundCollege = await this.getById(id, {});

    const { collegeName, universityId } = updateDto;
    const newUniversity = new Universities();

    newUniversity.id = universityId;
    foundCollege.collegeName = collegeName ?? foundCollege.collegeName;
    foundCollege.university = newUniversity ?? foundCollege.university;

    try {
      return await this.college.save(foundCollege);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('college does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.college.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('no college deleted');

    return deleted;
  }
}
