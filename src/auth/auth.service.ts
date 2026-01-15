import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Role } from '../users/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(email: string, name: string, password: string) {
    const existing = await this.users.findByEmail(email.toLowerCase());
    if (existing) throw new BadRequestException('Email already exists');

    const passwordHash = await bcrypt.hash(password, 10);

    // If you want the first user to be admin automatically, uncomment:
    // const role = (await this.users.listUsers()).length === 0 ? Role.ADMIN : Role.USER;
    const role = Role.USER;

    const user = await this.users.createUser({
      email,
      name,
      passwordHash,
      role,
    });
    return this.issueToken(user.id, user.email, user.role, user.name);
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email.toLowerCase());
    if (!user || !user.isActive)
      throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return this.issueToken(user.id, user.email, user.role, user.name);
  }

  issueToken(id: number, email: string, role: Role, name: string) {
    const payload = { sub: id, email, role, name };
    return {
      access_token: this.jwt.sign(payload),
      user: { id, email, role, name },
    };
  }
}
