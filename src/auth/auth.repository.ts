import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(@InjectRepository(Users) private user: Repository<Users>) {}

  async getUserByUserName(username: string): Promise<Users> {
    const user = await this.user.findOne({
      where: { username },
    });

    if (!user)
      throw new UnauthorizedException('username or password is incorrect');

    return user;
  }

  async getUserByEmail(email: string): Promise<Users> {
    const user = await this.user.findOne({
      where: { email },
    });

    if (!user)
      throw new UnauthorizedException('username or password is incorrect');

    return user;
  }

  async getUserById(id: string): Promise<Users> {
    const user = await this.user.findOne({
      where: { id },
    });

    if (!user)
      throw new UnauthorizedException('username or password is incorrect');

    return user;
  }
}
