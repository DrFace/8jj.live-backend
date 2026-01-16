import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Event } from './event.entity';

@Controller('events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  // GET /events?featured=true&upcoming=true
  @Get()
  async list(
    @Query('featured') featured?: string,
    @Query('sport') sport?: string,
    @Query('upcoming') upcoming?: string,
  ) {
    const where: any = {};
    if (featured === 'true') where.isFeatured = true;
    if (sport) where.sport = sport;
    if (upcoming === 'true') where.startsAt = MoreThanOrEqual(new Date());

    return this.eventRepo.find({
      where,
      order: { isFeatured: 'DESC', startsAt: 'ASC', id: 'ASC' },
      take: 50,
    });
  }
}
