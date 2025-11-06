import { Colleges } from 'src/colleges/entities/colleges.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Universities extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  universityName: string;

  @OneToMany(() => Colleges, (college) => college.university)
  colleges: Colleges[];
}
