import { CoreEntity } from 'src/common/entities/core.entity';
import { Students } from 'src/students/entities/students.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Groups extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  groupName: string;

  @OneToMany(() => Students, (student) => student.group)
  students: Students[];
}
