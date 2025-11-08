import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

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
}
