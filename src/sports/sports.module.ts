import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sport } from './sport.entity';
import { SportsController } from './sports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sport])],
  controllers: [SportsController],
})
export class SportsModule {}
