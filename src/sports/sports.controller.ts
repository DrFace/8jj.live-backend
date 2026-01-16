import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sport } from './sport.entity';

@Controller('sports')
export class SportsController {
  constructor(
    @InjectRepository(Sport)
    private readonly sportRepo: Repository<Sport>,
  ) {}

  @Get()
  async list() {
    return this.sportRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }
}
