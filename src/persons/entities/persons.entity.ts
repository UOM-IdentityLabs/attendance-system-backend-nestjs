import { CoreEntity } from 'src/common/entities/core.entity';
import { DepartmentHead } from 'src/department_head/entities/department-head.entity';
import { Students } from 'src/students/entities/students.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Persons extends CoreEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  firstName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  secondName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  thirdName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  fourthName: string;

  @Column({ type: 'varchar', nullable: true })
  image?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  phone?: string;

  @Column({ type: 'date', nullable: false })
  birthDate: Date;

  @OneToOne(() => DepartmentHead, (departmentHead) => departmentHead.person)
  departmentHead: DepartmentHead;

  @OneToOne(() => Teachers, (teacher) => teacher.person)
  teacher: Teachers;

  @OneToOne(() => Students, (student) => student.person)
  student: Students;
}
