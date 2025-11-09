import { Colleges } from 'src/colleges/entities/colleges.entity';
import { Courses } from 'src/courses/entities/courses.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

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
  @JoinColumn({ name: 'collegeId' })
  college: Colleges;

  @OneToMany(() => Courses, (course) => course.department)
  courses: Courses[];
}
