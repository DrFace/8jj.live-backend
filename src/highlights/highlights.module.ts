import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Highlight } from './highlight.entity';
import { HighlightsController } from './highlights.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Highlight])],
  controllers: [HighlightsController],
})
export class HighlightsModule {}
