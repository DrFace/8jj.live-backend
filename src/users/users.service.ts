import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async createUser(params: {
    email: string;
    name: string;
    passwordHash: string;
    role?: Role;
  }) {
    const u = this.repo.create({
      email: params.email.toLowerCase(),
      name: params.name,
      passwordHash: params.passwordHash,
      role: params.role ?? Role.USER,
    });
    return this.repo.save(u);
  }

  async setRole(userId: number, role: Role) {
    await this.repo.update({ id: userId }, { role });
    return this.findById(userId);
  }

  async listUsers() {
    return this.repo.find({ order: { id: 'DESC' } });
  }
}
