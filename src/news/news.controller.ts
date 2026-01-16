import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsArticle } from './news-article.entity';

@Controller('news')
export class NewsController {
  constructor(
    @InjectRepository(NewsArticle)
    private readonly newsRepo: Repository<NewsArticle>,
  ) {}

  // GET /news?category=Breaking%20Story&sport=cricket
  @Get()
  async list(
    @Query('category') category?: string,
    @Query('sport') sport?: string,
  ) {
    const where: any = { isPublished: true };
    if (category) where.category = category;
    if (sport) where.sport = sport;

    return this.newsRepo.find({
      where,
      order: { publishedAt: 'DESC', id: 'DESC' },
      take: 50,
    });
  }
}
