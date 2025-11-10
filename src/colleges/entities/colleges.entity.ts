import { CoreEntity } from 'src/common/entities/core.entity';
import { Departments } from 'src/departments/entities/departments.entity';
import { Universities } from 'src/universities/entities/universities.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Colleges extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  collegeName: string;

  @OneToMany(() => Departments, (department) => department.college)
  departments: Departments[];

  @ManyToOne(() => Universities, (university) => university.colleges)
  @JoinColumn({ name: 'university_id' })
  university: Universities;
}
