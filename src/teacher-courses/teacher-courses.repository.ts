import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateTeacherCoursesDto } from './dto/create-teacher-courses.dto';
import { TeacherCourses } from './entities/teacher-courses.entity';
import { UpdateTeacherCoursesDto } from './dto/update-teacher-courses.dto';
import { GetTeacherCoursesDto } from './dto/get-teacher-courses.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, ILike } from 'typeorm';
import { Courses } from 'src/courses/entities/courses.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';

@Injectable()
export class TeacherCoursesRepository
  implements
    IRepository<
      TeacherCourses,
      CreateTeacherCoursesDto,
      GetTeacherCoursesDto,
      UpdateTeacherCoursesDto
    >
{
  constructor(
    @InjectRepository(TeacherCourses)
    private teacherCourse: Repository<TeacherCourses>,
    @InjectRepository(Courses)
    private course: Repository<Courses>,
    @InjectRepository(Teachers)
    private teacher: Repository<Teachers>,
  ) {}

  async create(createDto: CreateTeacherCoursesDto): Promise<TeacherCourses> {
    const { courseType, group, courseId, teacherId } = createDto;

    const newTeacherCourse = new TeacherCourses();
    const newCourse = new Courses();
    const newTeacher = new Teachers();

    newCourse.id = courseId;
    newTeacher.id = teacherId;

    newTeacherCourse.courseType = courseType;
    newTeacherCourse.group = group;
    newTeacherCourse.course = newCourse;
    newTeacherCourse.teacher = newTeacher;

    try {
      return await this.teacherCourse.save(newTeacherCourse);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetTeacherCoursesDto) {
    const { search, limit, offset } = query;

    const [teacherCourses, total] = await this.teacherCourse.findAndCount({
      where: [{ courseType: search ? ILike(`%${search}%`) : undefined }],
      relations: ['course', 'teacher', 'teacher.person'],
      take: limit,
      skip: offset,
    });

    return { teacherCourses, total };
  }

  async getById(
    id: string,
    query: GetTeacherCoursesDto,
  ): Promise<TeacherCourses> {
    const foundTeacherCourse = await this.teacherCourse.findOne({
      where: { id },
      relations: ['course', 'teacher', 'teacher.person'],
    });

    if (!foundTeacherCourse)
      throw new NotFoundException('No teacher course found');

    return foundTeacherCourse;
  }

  async getTeacherCourses(req: any): Promise<TeacherCourses[]> {
    const teacherCourses = await this.teacherCourse.find({
      where: { teacher: { id: req.user.teacherId } },
      relations: ['course'],
    });
    if (!teacherCourses) throw new NotFoundException('No course(s) found');

    return teacherCourses;
  }

  async getStudentCourses(req: any): Promise<TeacherCourses[]> {
    const studentCourses = await this.teacherCourse.find({
      where: { course: { collegeYear: { id: req.user.collgeYearId } } },
      relations: ['course', 'course.collegeYear'],
    });

    if (!studentCourses) throw new NotFoundException('No course(s) found');

    return studentCourses;
  }

  async update(
    id: string,
    updateDto: UpdateTeacherCoursesDto,
  ): Promise<TeacherCourses> {
    const foundTeacherCourse = await this.getById(id, {});

    const { courseType, group, courseId, teacherId } = updateDto;

    if (courseType) {
      foundTeacherCourse.courseType = courseType;
    }

    if (group !== undefined) {
      foundTeacherCourse.group = group;
    }

    if (courseId) {
      const newCourse = new Courses();
      newCourse.id = courseId;
      foundTeacherCourse.course = newCourse;
    }

    if (teacherId) {
      const newTeacher = new Teachers();
      newTeacher.id = teacherId;
      foundTeacherCourse.teacher = newTeacher;
    }

    try {
      return await this.teacherCourse.save(foundTeacherCourse);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.teacherCourse.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('No teacher course deleted');

    return deleted;
  }
}
