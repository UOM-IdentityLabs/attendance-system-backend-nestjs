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
import { Repository, DeleteResult, In, Between } from 'typeorm';
import { Departments } from 'src/departments/entities/departments.entity';
import { Students } from 'src/students/entities/students.entity';
import { TeacherCourses } from 'src/teacher-courses/entities/teacher-courses.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';
import * as fs from 'fs';

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
    private students: Repository<Students>,
    private readonly httpService: HttpService,
  ) {}

  async create(createDto: CreateAttendanceDto, req): Promise<Attendance[]> {
    const { attendanceDate, status, teacherCourseId } = createDto;

    const imagePath =
      '/home/abdullah/Documents/Projects/attendance-system-ai/image_2.jpg';

    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));

    const response = await firstValueFrom(
      this.httpService.post('http://localhost:5000/api/attendance', form, {
        headers: form.getHeaders(),
      }),
    );

    const empIds = response.data.recognized.map((rec) => rec.emp_id);

    const students = await this.students.find({
      where: { id: In(empIds) },
    });

    if (!students) {
      throw new NotFoundException(
        'No students found for the recognized emp IDs',
      );
    }

    const attendanceRecords = students.map((student) => {
      const newAttendance = new Attendance();
      const newTeacherCourse = new TeacherCourses();
      const newDepartment = new Departments();

      newTeacherCourse.id = teacherCourseId;
      newDepartment.id = req.user.departmentId;

      newAttendance.attendanceDate = attendanceDate;
      newAttendance.status = status;
      newAttendance.student = student;
      newAttendance.teacherCourse = newTeacherCourse;
      newAttendance.department = newDepartment;

      return newAttendance;
    });

    try {
      const savedAttendances = await this.attendance.save(attendanceRecords);
      this.markAbsentStudents(req, attendanceDate, teacherCourseId);
      return savedAttendances;
    } catch (error) {
      if (error.code === '23503')
        throw new ConflictException('Referenced entity does not exist');

      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(query: GetAttendanceDto, req) {
    const { search, limit, offset, course, startDate, endDate } = query;

    const whereCondition: any = {};
    if (search) {
      whereCondition.status = search;
    }

    if (course) {
      whereCondition.teacherCourse = { id: course };
    }

    if (startDate && endDate) {
      whereCondition.attendanceDate = Between(startDate, endDate);
    }

    const [attendances, total] = await this.attendance.findAndCount({
      where: whereCondition,
      relations: ['student', 'student.person', 'student.group'],
      take: limit ?? 100,
      skip: offset ?? 0,
    });

    return { attendances, total };
  }

  async getMyAttendance(req, query: GetAttendanceDto) {
    const { search, limit, offset, course, startDate, endDate } = query;

    const whereCondition: any = {};
    if (search) {
      whereCondition.status = search;
    }

    if (course) {
      whereCondition.teacherCourse = { id: course };
    }

    if (req.user.studentId) {
      whereCondition.student = { id: req.user.studentId };
    }

    if (startDate && endDate) {
      whereCondition.attendanceDate = Between(startDate, endDate);
    }

    const [attendances, total] = await this.attendance.findAndCount({
      where: whereCondition,
      relations: ['student', 'teacherCourse', 'teacherCourse.course'],
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

    const { attendanceDate, status, teacherCourseId } = updateDto;

    if (attendanceDate) {
      foundAttendance.attendanceDate = attendanceDate;
    }

    if (status) {
      foundAttendance.status = status;
    }

    if (teacherCourseId) {
      const newTeacherCourse = new TeacherCourses();
      newTeacherCourse.id = teacherCourseId;
      foundAttendance.teacherCourse = newTeacherCourse;
    }

    // if (departmentId) {
    //   const newDepartment = new Departments();
    //   newDepartment.id = departmentId;
    //   foundAttendance.department = newDepartment;
    // }

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

  private async markAbsentStudents(
    req: any,
    attendanceDate: Date,
    teacherCourseId: string,
  ) {
    const students = await this.students.find({
      where: { department: { id: req.user.departmentId } },
    });
    const studentIds = students.map((s) => s.id);

    if (studentIds.length === 0) {
      return;
    }

    const existingAttendances = await this.attendance.find({
      relations: ['student'],
      where: {
        attendanceDate: attendanceDate,
        student: { id: In(studentIds) },
        teacherCourse: { id: teacherCourseId },
      },
    });

    const existingStudentIds = existingAttendances.map((a) => a.student.id);
    const absentStudentIds = studentIds.filter(
      (id) => !existingStudentIds.includes(id),
    );

    const absentAttendances = absentStudentIds.map((studentId) => {
      const newAttendance = new Attendance();
      const newTeacherCourse = new TeacherCourses();
      const newDepartment = new Departments();

      newTeacherCourse.id = teacherCourseId;
      newDepartment.id = req.user.departmentId;

      newAttendance.attendanceDate = attendanceDate;
      newAttendance.status = 'absent';
      newAttendance.student = { id: studentId } as any;
      newAttendance.teacherCourse = newTeacherCourse;
      newAttendance.department = newDepartment;

      return newAttendance;
    });

    try {
      await this.attendance.save(absentAttendances);
    } catch (error) {
      console.error('Error marking absent students:', error);
    }
  }
}
