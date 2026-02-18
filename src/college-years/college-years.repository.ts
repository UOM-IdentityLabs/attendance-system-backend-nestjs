import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateCollegeYearsDto } from './dto/create-college-years.dto';
import { CollegeYears } from './entities/college-years.entity';
import { UpdateCollegeYearsDto } from './dto/update-college-years.dto';
import { GetCollegeYearsDto } from './dto/get-college-years.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';

@Injectable()
export class CollegeYearsRepository
  implements
    IRepository<
      CollegeYears,
      CreateCollegeYearsDto,
      GetCollegeYearsDto,
      UpdateCollegeYearsDto
    >
{
  constructor(
    @InjectRepository(CollegeYears)
    private collegeYear: Repository<CollegeYears>,
  ) {}

  async create(createDto: CreateCollegeYearsDto): Promise<CollegeYears> {
    const { yearName } = createDto;

    const newCollegeYear = new CollegeYears();

    newCollegeYear.yearName = yearName;

    try {
      return await this.collegeYear.save(newCollegeYear);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('college year already exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetCollegeYearsDto) {
    const { search, limit, offset } = query;

    const [collegeYears, total] = await this.collegeYear.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: { yearName: search ? ILike(`%${search}%`) : undefined },
    });

    return { collegeYears, total };
  }

  async getById(id: string, query: GetCollegeYearsDto): Promise<CollegeYears> {
    const foundCollegeYear = await this.collegeYear.findOne({ where: { id } });

    if (!foundCollegeYear) throw new NotFoundException('no college year found');

    return foundCollegeYear;
  }

  async update(
    id: string,
    updateDto: UpdateCollegeYearsDto,
  ): Promise<CollegeYears> {
    const foundCollegeYear = await this.getById(id, {});

    const { yearName } = updateDto;

    foundCollegeYear.yearName = yearName ?? foundCollegeYear.yearName;

    try {
      return await this.collegeYear.save(foundCollegeYear);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('college year does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.collegeYear.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('no college year deleted');

    return deleted;
  }
}
