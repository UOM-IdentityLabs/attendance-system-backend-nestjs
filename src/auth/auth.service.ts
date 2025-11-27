import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from 'src/common/classes/bcrypt.class';
import { LoginDto } from './dto/login.dto';
import { UserRoleEnum } from 'src/users/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly bcrypt: Bcrypt,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.authRepository.getUserByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException();
    }

    if (
      !(await this.bcrypt.isValidPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('email or password is incorrect');
    }

    const { id, role, email, student, teacher, departmentHead } = user;

    const payload: any = {
      sub: id,
      role,
      email,
    };

    if (role === UserRoleEnum.STUDENT) {
      payload.studentId = student?.id;
      payload.departmentId = student?.department?.id;
      payload.groupId = student?.group?.id;
      payload.collegeYearId = student?.collegeYear?.id;
    }

    if (role === UserRoleEnum.TEACHER) {
      payload.teacherId = teacher?.id;
      payload.departmentId = teacher?.department?.id;
    }

    if (role === UserRoleEnum.DEPARTMENT_HEAD) {
      payload.departmentHeadId = departmentHead?.id;
      payload.departmentId = departmentHead?.department?.id;
    }

    const token = await this.jwtService.signAsync(payload);

    user.password = '';

    return { user, token };
  }
}
