import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsModule } from './sports/sports.module';
import { ChannelsModule } from './channels/channels.module';
import { NewsModule } from './news/news.module';
import { HighlightsModule } from './highlights/highlights.module';
import { EventsModule } from './events/events.module';
import { ShopModule } from './shop/shop.module';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MatchesModule } from './matches/matches.module';
import { ChatModule } from './chat/chat.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { User } from './users/user.entity';
import { Match } from './matches/match.entity';
import { ChatMessage } from './chat/chat-message.entity';
import { AnalyticsEvent } from './analytics/analytics-event.entity';

// NEW entities
import { Sport } from './sports/sport.entity';
import { Channel } from './channels/channel.entity';
import { NewsArticle } from './news/news-article.entity';
import { Highlight } from './highlights/highlight.entity';
import { Event } from './events/event.entity';
import { ShopItem } from './shop/shop-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SportsModule,
    ChannelsModule,
    NewsModule,
    HighlightsModule,
    EventsModule,
    ShopModule,

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',
        host: cfg.get('DB_HOST'),
        port: Number(cfg.get('DB_PORT')),
        username: cfg.get('DB_USERNAME'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_NAME'),
        entities: [
          User,
          Match,
          ChatMessage,
          AnalyticsEvent,
          // NEW
          Sport,
          Channel,
          NewsArticle,
          Highlight,
          Event,
          ShopItem,
        ],
        synchronize: true, // ✅ for fast MVP (use migrations later)
      }),
    }),

    UsersModule,
    AuthModule,
    MatchesModule,
    ChatModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
