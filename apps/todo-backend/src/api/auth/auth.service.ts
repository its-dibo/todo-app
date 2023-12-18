import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '#api/users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UserEntity, UserRole } from '#api/users/entities/user.entity';

export interface JwtUser {
  sub: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  login({ email, password }: { email: string; password: string }) {
    return this.usersService.getPassword(email).then((user) => {
      if (!user)
        throw new UnauthorizedException(
          `no account found for the entry ${email}, register a new account`,
        );

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('wrong password');

      let { password: pass, ...result } = user;
      return {
        ...result,
        fullName: user.fullName(),
        auth_token: this.sign(user),
      };
    });
  }

  register(data: UserEntity) {
    return this.usersService.create(data).then((user) => ({
      ...user,
      auth_token: this.sign(user),
    }));
  }

  sign(user: UserEntity) {
    if (!user.id) throw new Error(`[Auth] user.id is empty!`);
    return this.jwtService.sign(<JwtUser>{ sub: user.id, role: user.role }, {
      algorithm: 'RS256',
    });
  }
}
