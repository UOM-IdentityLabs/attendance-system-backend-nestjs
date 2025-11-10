import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IRepository } from 'src/common/interfaces/repository.interfance.tsrepository.interfance';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { GetAttendanceDto } from './dto/get-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Departments } from 'src/departments/entities/departments.entity';
import { Students } from 'src/students/entities/students.entity';
import { TeacherCourses } from 'src/teacher_courses/entities/teacher-courses.entity';

@Injectable()
export class AttendanceRepository
  implements
    IRepository<
      Attendance,
      CreateAttendanceDto,
      GetAttendanceDto,
      UpdateAttendanceDto
    >
{
  constructor(
    @InjectRepository(Attendance)
    private attendance: Repository<Attendance>,
    @InjectRepository(Students)
    private student: Repository<Students>,
    @InjectRepository(TeacherCourses)
    private teacherCourse: Repository<TeacherCourses>,
    @InjectRepository(Departments)
    private department: Repository<Departments>,
  ) {}

  async create(createDto: CreateAttendanceDto): Promise<Attendance> {
    const { attendanceDate, status, studentId, teacherCourseId, departmentId } =
      createDto;

    const newAttendance = new Attendance();
    const newStudent = new Students();
    const newTeacherCourse = new TeacherCourses();
    const newDepartment = new Departments();

    newStudent.id = studentId;
    newTeacherCourse.id = teacherCourseId;
    newDepartment.id = departmentId;

    newAttendance.attendanceDate = attendanceDate;
    newAttendance.status = status || 'Absent';
    newAttendance.student = newStudent;
    newAttendance.teacherCourse = newTeacherCourse;
    newAttendance.department = newDepartment;

    try {
      return await this.attendance.save(newAttendance);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetAttendanceDto) {
    const { search, limit, offset } = query;

    const [attendances, total] = await this.attendance.findAndCount({
      where: [{ status: search }],
      relations: [
        'student',
        'student.person',
        'teacherCourse',
        'teacherCourse.course',
        'teacherCourse.teacher',
        'teacherCourse.teacher.person',
        'department',
      ],
      take: limit ?? 100,
      skip: offset ?? 0,
    });

    return { attendances, total };
  }

  async getById(id: string, query: GetAttendanceDto): Promise<Attendance> {
    const foundAttendance = await this.attendance.findOne({
      where: { id },
      relations: [
        'student',
        'student.person',
        'teacherCourse',
        'teacherCourse.course',
        'teacherCourse.teacher',
        'teacherCourse.teacher.person',
        'department',
      ],
    });

    if (!foundAttendance)
      throw new NotFoundException('No attendance record found');

    return foundAttendance;
  }

  async update(
    id: string,
    updateDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    const foundAttendance = await this.getById(id, {});

    const { attendanceDate, status, studentId, teacherCourseId, departmentId } =
      updateDto;

    if (attendanceDate) {
      foundAttendance.attendanceDate = attendanceDate;
    }

    if (status) {
      foundAttendance.status = status;
    }

    if (studentId) {
      const newStudent = new Students();
      newStudent.id = studentId;
      foundAttendance.student = newStudent;
    }

    if (teacherCourseId) {
      const newTeacherCourse = new TeacherCourses();
      newTeacherCourse.id = teacherCourseId;
      foundAttendance.teacherCourse = newTeacherCourse;
    }

    if (departmentId) {
      const newDepartment = new Departments();
      newDepartment.id = departmentId;
      foundAttendance.department = newDepartment;
    }

    try {
      return await this.attendance.save(foundAttendance);
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    const deleted = await this.attendance.softDelete(id);

    if (deleted.affected === 0)
      throw new NotFoundException('No attendance record deleted');

    return deleted;
  }
}
