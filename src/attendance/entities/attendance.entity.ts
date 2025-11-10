import { CoreEntity } from 'src/common/entities/core.entity';
import { Departments } from 'src/departments/entities/departments.entity';
import { Students } from 'src/students/entities/students.entity';
import { TeacherCourses } from 'src/teacher_courses/entities/teacher-courses.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Attendance extends CoreEntity {
  @Column({
    type: 'date',
    nullable: false,
  })
  attendanceDate: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: 'Absent',
  })
  status: string;

  @ManyToOne(() => Students, (student) => student.attendances)
  @JoinColumn({ name: 'student_id' })
  student: Students;

  @ManyToOne(() => TeacherCourses, (teacherCourse) => teacherCourse.attendances)
  @JoinColumn({ name: 'teacher_course_id' })
  teacherCourse: TeacherCourses;

  @ManyToOne(() => Departments, (department) => department.attendances)
  @JoinColumn({ name: 'department_id' })
  department: Departments;
}
