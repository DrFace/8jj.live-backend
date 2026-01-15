import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MatchesModule } from './matches/matches.module';
import { ChatModule } from './chat/chat.module';
import { AnalyticsModule } from './analytics/analytics.module';

import { User } from './users/user.entity';
import { Match } from './matches/match.entity';
import { ChatMessage } from './chat/chat-message.entity';
import { AnalyticsEvent } from './analytics/analytics-event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'mysql',
        host: cfg.get('DB_HOST'),
        port: Number(cfg.get('DB_PORT')),
        username: cfg.get('DB_USERNAME'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_NAME'),
        entities: [User, Match, ChatMessage, AnalyticsEvent],
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
