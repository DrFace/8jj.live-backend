import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent } from './analytics-event.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly repo: Repository<AnalyticsEvent>,
  ) {}

  async trackEvent(evt: {
    matchId: number;
    type: string;
    userId: number | null;
    meta?: any;
  }) {
    const e = this.repo.create({
      matchId: evt.matchId,
      type: evt.type,
      userId: evt.userId,
      meta: evt.meta ?? null,
    });
    return this.repo.save(e);
  }

  async getMatchSummary(matchId: number) {
    const totalViewJoins = await this.repo.count({
      where: { matchId, type: 'viewer_join' },
    });
    const totalMessages = await this.repo.count({
      where: { matchId, type: 'chat_message' },
    });

    const peakRow = await this.repo
      .createQueryBuilder('e')
      .select('MAX(JSON_EXTRACT(e.meta, "$.viewers"))', 'peak')
      .where('e.matchId = :matchId', { matchId })
      .andWhere('e.type IN (:...types)', {
        types: ['viewer_join', 'viewer_leave'],
      })
      .getRawOne<{ peak: string | null }>();

    const peak = peakRow?.peak ? Number(peakRow.peak) : 0;

    return { matchId, totalViewJoins, totalMessages, peakViewers: peak };
  }

  async getPeakOffPeak(matchId: number) {
    const rows = await this.repo
      .createQueryBuilder('e')
      .select('DATE_FORMAT(e.createdAt, "%Y-%m-%d %H:00:00")', 'hour')
      .addSelect('COUNT(*)', 'count')
      .where('e.matchId = :matchId', { matchId })
      .andWhere('e.type = :type', { type: 'viewer_join' })
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany<{ hour: string; count: string }>();

    return rows.map((r) => ({ hour: r.hour, joins: Number(r.count) }));
  }
}
