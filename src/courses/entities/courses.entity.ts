import { Departments } from 'src/departments/entities/departments.entity';
import { CollegeYears } from 'src/college_years/entities/college-years.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { TeacherCourses } from 'src/teacher_courses/entities/teacher-courses.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Courses extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  courseName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  semester: string;

  @ManyToOne(() => Departments, (department) => department.courses)
  @JoinColumn({ name: 'department_id' })
  department: Departments;

  @ManyToOne(() => CollegeYears, (collegeYear) => collegeYear.courses)
  @JoinColumn({ name: 'college_year_id' })
  collegeYear: CollegeYears;

  @OneToMany(() => TeacherCourses, (teacherCourse) => teacherCourse.course)
  teacherCourses: TeacherCourses[];
}
