import { CoreEntity } from 'src/common/entities/core.entity';
import { DepartmentHead } from 'src/department-head/entities/department-head.entity';
import { Students } from 'src/students/entities/students.entity';
import { Teachers } from 'src/teachers/entities/teachers.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity()
export class Users extends CoreEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  role: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @OneToOne(() => DepartmentHead, (departmentHead) => departmentHead.user)
  departmentHead: DepartmentHead;

  @OneToOne(() => Teachers, (teacher) => teacher.user)
  teacher: Teachers;

  @OneToOne(() => Students, (student) => student.user)
  student: Students;
}
