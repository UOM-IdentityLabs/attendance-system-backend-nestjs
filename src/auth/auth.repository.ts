import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(@InjectRepository(Users) private user: Repository<Users>) {}

  // async getUserByUserName(username: string): Promise<Users> {
  //   const basicUser = await this.user.findOne({
  //     where: { username },
  //   });

  //   if (!basicUser)
  //     throw new UnauthorizedException('username or password is incorrect');

  //   const relations = this.getRelationsByRole(basicUser.role);

  //   const user = await this.user.findOne({
  //     where: { username },
  //     relations,
  //   });

  //   if (!user)
  //     throw new UnauthorizedException('username or password is incorrect');

  //   return user;
  // }

  async getUserByEmail(email: string): Promise<Users> {
    const basicUser = await this.user.findOne({
      where: { email },
    });

    if (!basicUser)
      throw new UnauthorizedException('email or password is incorrect');

    const relations = this.getRelationsByRole(basicUser.role);

    const user = await this.user.findOne({
      where: { email },
      relations,
    });

    if (!user)
      throw new UnauthorizedException('email or password is incorrect');

    return user;
  }

  async getUserById(id: string): Promise<Users> {
    const basicUser = await this.user.findOne({
      where: { id },
    });

    if (!basicUser)
      throw new UnauthorizedException('username or password is incorrect');

    const relations = this.getRelationsByRole(basicUser.role);

    const user = await this.user.findOne({
      where: { id },
      relations,
    });

    if (!user)
      throw new UnauthorizedException('username or password is incorrect');

    return user;
  }

  private getRelationsByRole(role: string): string[] {
    switch (role) {
      case UserRoleEnum.STUDENT:
        return [
          'student',
          'student.group',
          'student.department',
          'student.collegeYear',
        ];
      case UserRoleEnum.TEACHER:
        return ['teacher', 'teacher.department'];
      case UserRoleEnum.DEPARTMENT_HEAD:
        return ['departmentHead', 'departmentHead.department'];
      default:
        return [];
    }
  }
}
