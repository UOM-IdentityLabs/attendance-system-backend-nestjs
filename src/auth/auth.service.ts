import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from 'src/common/classes/bcrypt.class';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly bcrypt: Bcrypt,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    let user: any;
    if (loginDto.login.includes('@')) {
      user = await this.authRepository.getUserByEmail(loginDto.login);
    } else {
      user = await this.authRepository.getUserByUserName(loginDto.login);
    }

    if (!user) {
      throw new NotFoundException();
    }

    if (
      !(await this.bcrypt.isValidPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('username or password is incorrect');
    }

    const { id, username, role, email, student, teacher, departmentHead } =
      user;

    const payload: any = {
      sub: id,
      username,
      role,
      email,
    };

    if (role === 'student') {
      payload.studentId = student?.id;
      payload.departmentId = student?.department?.id;
      payload.groupId = student?.group?.id;
      payload.collegeYearId = student?.collegeYear?.id;
    }

    if (role === 'teacher') {
      payload.teacherId = teacher?.id;
      payload.departmentId = teacher?.department?.id;
    }

    if (role === 'department_head') {
      payload.departmentHeadId = departmentHead?.id;
      payload.departmentId = departmentHead?.department?.id;
    }

    const token = await this.jwtService.signAsync(payload);

    delete user.password;

    return { user, token };
  }
}
