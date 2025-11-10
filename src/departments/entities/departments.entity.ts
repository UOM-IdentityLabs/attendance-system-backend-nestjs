import { Colleges } from 'src/colleges/entities/colleges.entity';
import { Courses } from 'src/courses/entities/courses.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { DepartmentHead } from 'src/department_head/entities/department-head.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Departments extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  departmentName: string;

  @ManyToOne(() => Colleges, (college) => college.departments)
  @JoinColumn({ name: 'college_id' })
  college: Colleges;

  @OneToMany(() => Courses, (course) => course.department)
  courses: Courses[];

  @OneToMany(
    () => DepartmentHead,
    (departmentHead) => departmentHead.department,
  )
  departmentHeads: DepartmentHead[];

  @OneToMany(() => Teachers, (teacher) => teacher.department)
  teachers: Teachers[];
}
