import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateCoursesDto } from './dto/create-courses.dto';
import { Courses } from './entities/courses.entity';
import { UpdateCoursesDto } from './dto/update-courses.dto';
import { GetCoursesDto } from './dto/get-courses.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';
import { Departments } from 'src/departments/entities/departments.entity';
import { CollegeYears } from 'src/college_years/entities/college-years.entity';

@Injectable()
export class CoursesRepository
  implements
    IRepository<Courses, CreateCoursesDto, GetCoursesDto, UpdateCoursesDto>
{
  constructor(
    @InjectRepository(Courses)
    private course: Repository<Courses>,
    @InjectRepository(Departments)
    private department: Repository<Departments>,
    @InjectRepository(CollegeYears)
    private collegeYear: Repository<CollegeYears>,
  ) {}

  async create(createDto: CreateCoursesDto): Promise<Courses> {
    const { courseName, semester, departmentId, collegeYearId } = createDto;

    const newCourse = new Courses();
    const newDepartment = new Departments();
    const newCollegeYear = new CollegeYears();

    newDepartment.id = departmentId;
    newCollegeYear.id = collegeYearId;
    newCourse.courseName = courseName;
    newCourse.semester = semester;
    newCourse.department = newDepartment;
    newCourse.collegeYear = newCollegeYear;

    try {
      return await this.course.save(newCourse);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('course already exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetCoursesDto) {
    const { search, limit, offset } = query;

    const [courses, total] = await this.course.findAndCount({
      take: limit ?? 100,
      skip: offset ?? 0,
      where: { courseName: search ? ILike(`%${search}%`) : undefined },
      relations: ['department', 'collegeYear'],
    });

    return { courses, total };
  }

  async getById(id: string, query: GetCoursesDto): Promise<Courses> {
    const foundCourse = await this.course.findOne({
      where: { id },
      relations: ['department', 'collegeYear'],
    });

    if (!foundCourse) throw new NotFoundException('no course found');

    return foundCourse;
  }

  async update(id: string, updateDto: UpdateCoursesDto): Promise<Courses> {
    const foundCourse = await this.getById(id, {});

    const { courseName, semester, departmentId, collegeYearId } = updateDto;

    const newDepartment = new Departments();
    const newCollegeYear = new CollegeYears();

    newDepartment.id = departmentId;
    newCollegeYear.id = collegeYearId;
    foundCourse.department = newDepartment ?? foundCourse.department;
    foundCourse.collegeYear = newCollegeYear ?? foundCourse.collegeYear;
    foundCourse.courseName = courseName ?? foundCourse.courseName;
    foundCourse.semester = semester ?? foundCourse.semester;

    try {
      return await this.course.save(foundCourse);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('course does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.course.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('no course deleted');

    return deleted;
  }
}
