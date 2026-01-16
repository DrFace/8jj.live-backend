import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopItem } from './shop-item.entity';

@Controller('shop')
export class ShopController {
  constructor(
    @InjectRepository(ShopItem)
    private readonly shopRepo: Repository<ShopItem>,
  ) {}

  // GET /shop?active=true
  @Get()
  async list(@Query('active') active?: string) {
    const where: any = {};
    if (active === 'true') where.isActive = true;

    return this.shopRepo.find({
      where,
      order: { pointsCost: 'ASC', id: 'ASC' },
      take: 100,
    });
  }
}
