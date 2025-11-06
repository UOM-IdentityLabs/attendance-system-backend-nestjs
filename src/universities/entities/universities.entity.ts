import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Universities extends CoreEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  universityName: string;
}
