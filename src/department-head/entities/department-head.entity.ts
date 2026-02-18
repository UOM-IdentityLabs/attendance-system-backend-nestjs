import { CoreEntity } from 'src/common/entities/core.entity';
import { Departments } from 'src/departments/entities/departments.entity';
import { Persons } from 'src/persons/entities/persons.entity';
import { Users } from 'src/users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class DepartmentHead extends CoreEntity {
  @OneToOne(() => Persons)
  @JoinColumn({ name: 'person_id' })
  person: Persons;

  @OneToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Departments)
  @JoinColumn({ name: 'department_id' })
  department: Departments;
}
