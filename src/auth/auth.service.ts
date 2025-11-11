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
      //throw new UnauthorizedException('username or password is incorrect');
    }

    const { id, username, role, email } = user;

    const token = await this.jwtService.signAsync({
      id,
      username,
      role,
      email,
    });

    delete user.password;

    return { user, token };
  }
}
