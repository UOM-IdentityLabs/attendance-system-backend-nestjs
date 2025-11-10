import { CoreEntity } from 'src/common/entities/core.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { CollegeYears } from 'src/college_years/entities/college-years.entity';
import { Departments } from 'src/departments/entities/departments.entity';
import { Groups } from 'src/groups/entities/groups.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Students extends CoreEntity {
  @OneToOne(() => Persons, (person) => person.student)
  @JoinColumn({ name: 'person_id' })
  person: Persons;

  @OneToOne(() => Users, (user) => user.student)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Groups, (group) => group.students)
  @JoinColumn({ name: 'group_id' })
  group: Groups;

  @ManyToOne(() => Departments, (department) => department.students)
  @JoinColumn({ name: 'department_id' })
  department: Departments;

  @ManyToOne(() => CollegeYears, (collegeYear) => collegeYear.students)
  @JoinColumn({ name: 'college_year_id' })
  collegeYear: CollegeYears;

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];
}
