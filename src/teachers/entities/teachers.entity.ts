import { CoreEntity } from 'src/common/entities/core.entity';
import { Departments } from 'src/departments/entities/departments.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { TeacherCourses } from 'src/teacher_courses/entities/teacher-courses.entity';
import { Users } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class Teachers extends CoreEntity {
  @OneToOne(() => Persons, (person) => person.teacher)
  @JoinColumn({ name: 'person_id' })
  person: Persons;

  @OneToOne(() => Users, (user) => user.teacher)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  specialization: string;

  @ManyToOne(() => Departments, (department) => department.teachers)
  @JoinColumn({ name: 'department_id' })
  department: Departments;

  @OneToMany(() => TeacherCourses, (teacherCourse) => teacherCourse.teacher)
  teacherCourses: TeacherCourses[];
}
