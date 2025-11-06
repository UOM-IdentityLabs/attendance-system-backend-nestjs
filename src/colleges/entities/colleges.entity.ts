import { CoreEntity } from 'src/common/entities/core.entity';
import { Universities } from 'src/universities/entities/universities.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Colleges extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  collegeName: string;

  @ManyToOne(() => Universities, (university) => university.colleges)
  @JoinColumn({ name: 'universityId' })
  university: Universities;
}
