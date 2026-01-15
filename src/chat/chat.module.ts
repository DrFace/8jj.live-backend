import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { ChatMessage } from './chat-message.entity';
import { AnalyticsModule } from '../analytics/analytics.module';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage]),
    AnalyticsModule,
    MatchesModule,
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
