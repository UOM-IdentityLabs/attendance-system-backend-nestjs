import { Courses } from 'src/courses/entities/courses.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class CollegeYears extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  yearName: string;

  @OneToMany(() => Courses, (course) => course.collegeYear)
  courses: Courses[];
}
