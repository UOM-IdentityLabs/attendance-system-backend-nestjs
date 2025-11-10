import { CoreEntity } from 'src/common/entities/core.entity';
import { Courses } from 'src/courses/entities/courses.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class TeacherCourses extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  courseType: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  group?: string;

  @ManyToOne(() => Courses, (course) => course.teacherCourses)
  @JoinColumn({ name: 'course_id' })
  course: Courses;

  @ManyToOne(() => Teachers, (teacher) => teacher.teacherCourses)
  @JoinColumn({ name: 'teacher_id' })
  teacher: Teachers;
}
