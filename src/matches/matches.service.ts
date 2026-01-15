import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

@Injectable()
export class MatchesService {
  constructor(@InjectRepository(Match) private repo: Repository<Match>) {}

  list() {
    return this.repo.find({ order: { startsAt: 'ASC' } });
  }

  get(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Match>) {
    const m = this.repo.create(data);
    return this.repo.save(m);
  }

  async update(id: number, data: Partial<Match>) {
    const existing = await this.get(id);
    if (!existing) throw new NotFoundException('Match not found');
    Object.assign(existing, data);
    return this.repo.save(existing);
  }
}
