import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateUniversitiesDto } from './dto/create-universities.dto';
import { Universities } from './entities/universities.entity';
import { UpdateUniversitiesDto } from './dto/update-universities.dto';
import { GetUniversitiesDto } from './dto/get-universities.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';

@Injectable()
export class UniversitiesRepository
  implements
    IRepository<
      Universities,
      CreateUniversitiesDto,
      GetUniversitiesDto,
      UpdateUniversitiesDto
    >
{
  constructor(
    @InjectRepository(Universities)
    private university: Repository<Universities>,
  ) {}

  async create(createDto: CreateUniversitiesDto): Promise<Universities> {
    const { universityName } = createDto;

    const newUniversity = new Universities();

    newUniversity.universityName = universityName;

    try {
      return await this.university.save(newUniversity);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('university already exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetUniversitiesDto) {
    const { search, limit, offset } = query;

    const [universities, total] = await this.university.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: { universityName: search ? ILike(`%${search}%`) : undefined },
    });

    return { universities, total };
  }

  async getById(id: string, query: GetUniversitiesDto): Promise<Universities> {
    const foundUniversity = await this.university.findOne({ where: { id } });

    if (!foundUniversity) throw new NotFoundException('no university found');

    return foundUniversity;
  }

  async update(
    id: string,
    updateDto: UpdateUniversitiesDto,
  ): Promise<Universities> {
    const foundUniversity = await this.getById(id, {});

    const { universityName } = updateDto;

    foundUniversity.universityName =
      universityName ?? foundUniversity.universityName;

    try {
      return await this.university.save(foundUniversity);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('university does not exist');

      throw new InternalServerErrorException(error.message);
    }

    return foundUniversity;
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.university.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('no university deleted');

    return deleted;
  }
}
