import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreatePersonsDto } from './dto/create-persons.dto';
import { GetPersonsDto } from './dto/get-persons.dto';
import { UpdatePersonsDto } from './dto/updte-persons.dto';
import { Persons } from './entities/persons.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class PersonsRepository
  implements
    IRepository<Persons, CreatePersonsDto, GetPersonsDto, UpdatePersonsDto>
{
  constructor(
    @InjectRepository(Persons) private readonly person: Repository<Persons>,
  ) {}

  async create(createDto: CreatePersonsDto): Promise<Persons> {
    const {
      firstName,
      secondName,
      thirdName,
      fourthName,
      image,
      email,
      phone,
      birthDate,
    } = createDto;

    const newPerson = new Persons();

    newPerson.firstName = firstName;
    newPerson.secondName = secondName;
    newPerson.thirdName = thirdName;
    newPerson.fourthName = fourthName;
    newPerson.image = image;
    newPerson.email = email;
    newPerson.phone = phone;
    newPerson.birthDate = birthDate;

    try {
      return await this.person.save(newPerson);
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException(
          'Person with this email or phone already exists',
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetPersonsDto) {
    const { limit, offset, search } = query;

    const [persons, total] = await this.person.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: [
        { firstName: search ? ILike(`%${search}%`) : undefined },
        { secondName: search ? ILike(`%${search}%`) : undefined },
        { thirdName: search ? ILike(`%${search}%`) : undefined },
        { fourthName: search ? ILike(`%${search}%`) : undefined },
        { email: search ? ILike(`%${search}%`) : undefined },
        { phone: search ? ILike(`%${search}%`) : undefined },
      ],
    });

    return { persons, total };
  }

  async getById(id: string, query: GetPersonsDto): Promise<Persons> {
    const foundPerson = await this.person.findOne({ where: { id } });

    if (!foundPerson) throw new NotFoundException('no person found');

    return foundPerson;
  }

  async update(id: string, updateDto: UpdatePersonsDto): Promise<Persons> {
    const foundPerson = await this.getById(id, {});

    const {
      firstName,
      secondName,
      thirdName,
      fourthName,
      image,
      email,
      phone,
      birthDate,
    } = updateDto;

    foundPerson.firstName = firstName ?? foundPerson.firstName;
    foundPerson.secondName = secondName ?? foundPerson.secondName;
    foundPerson.thirdName = thirdName ?? foundPerson.thirdName;
    foundPerson.fourthName = fourthName ?? foundPerson.fourthName;
    foundPerson.image = image ?? foundPerson.image;
    foundPerson.email = email ?? foundPerson.email;
    foundPerson.phone = phone ?? foundPerson.phone;
    foundPerson.birthDate = birthDate ?? foundPerson.birthDate;

    try {
      return await this.person.save(foundPerson);
    } catch (error) {
      if (error.code === '23503') {
        throw new ConflictException(
          'Person with this email or phone already exists',
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string) {
    const deleted = await this.person.softDelete(id);

    if (deleted.affected === 0) {
      throw new NotFoundException('no person found to delete');
    }

    return deleted;
  }
}
