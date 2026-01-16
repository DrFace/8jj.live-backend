import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@Controller('channels')
export class ChannelsController {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
  ) {}

  @Get()
  async getAllChannels() {
    return this.channelRepo.find({
      order: { sortOrder: 'ASC' },
    });
  }
}
