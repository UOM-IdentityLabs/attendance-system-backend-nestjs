import { Departments } from 'src/departments/entities/departments.entity';
import { CollegeYears } from 'src/college_years/entities/college-years.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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
  @JoinColumn({ name: 'departmentId' })
  department: Departments;

  @ManyToOne(() => CollegeYears, (collegeYear) => collegeYear.courses)
  @JoinColumn({ name: 'collegeYearId' })
  collegeYear: CollegeYears;
}
