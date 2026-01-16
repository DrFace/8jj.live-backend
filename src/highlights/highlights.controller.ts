import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Highlight } from './highlight.entity';

@Controller('highlights')
export class HighlightsController {
  constructor(
    @InjectRepository(Highlight)
    private readonly highlightRepo: Repository<Highlight>,
  ) {}

  // GET /highlights?sport=football&trending=true
  @Get()
  async list(
    @Query('sport') sport?: string,
    @Query('trending') trending?: string,
  ) {
    const where: any = {};
    if (sport) where.sport = sport;
    if (trending === 'true') where.isTrending = true;

    return this.highlightRepo.find({
      where,
      order: { isTrending: 'DESC', views: 'DESC', id: 'DESC' },
      take: 50,
    });
  }
}
