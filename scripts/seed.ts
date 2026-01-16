import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { User } from '../src/users/user.entity';
import { Match } from '../src/matches/match.entity';
import { ChatMessage } from '../src/chat/chat-message.entity';
import { AnalyticsEvent } from '../src/analytics/analytics-event.entity';

import { Sport } from '../src/sports/sport.entity';
import { Channel } from '../src/channels/channel.entity';
import { NewsArticle } from '../src/news/news-article.entity';
import { Highlight } from '../src/highlights/highlight.entity';
import { Event } from '../src/events/event.entity';
import { ShopItem } from '../src/shop/shop-item.entity';

dotenv.config();

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function seedSports(ds: DataSource) {
  const repo = ds.getRepository(Sport);

  const rows: Array<Partial<Sport>> = [
    {
      slug: 'cricket',
      name: 'Cricket',
      sortOrder: 1,
      isActive: true,
      iconUrl: null,
    },
    {
      slug: 'football',
      name: 'Football',
      sortOrder: 2,
      isActive: true,
      iconUrl: null,
    },
    {
      slug: 'basketball',
      name: 'Basketball',
      sortOrder: 3,
      isActive: true,
      iconUrl: null,
    },
  ];

  for (const r of rows) {
    const exists = await repo.findOne({ where: { slug: r.slug! } });
    if (!exists) await repo.save(repo.create(r));
  }

  console.log(`✅ Seeded sports: ${rows.length}`);
}

async function seedChannels(ds: DataSource) {
  const repo = ds.getRepository(Channel);

  const rows: Array<Partial<Channel>> = [
    {
      slug: 'main-cricket',
      sport: 'cricket',
      name: 'Cricket Main',
      logoUrl: null,
      streamUrl: null,
      isLive: false,
      sortOrder: 1,
    },
    {
      slug: 'football-live-1',
      sport: 'football',
      name: 'Football Live 1',
      logoUrl: null,
      streamUrl: null,
      isLive: false,
      sortOrder: 1,
    },
    {
      slug: 'basketball-live-1',
      sport: 'basketball',
      name: 'Basketball Live 1',
      logoUrl: null,
      streamUrl: null,
      isLive: false,
      sortOrder: 1,
    },
  ];

  for (const r of rows) {
    const exists = await repo.findOne({ where: { slug: r.slug! } });
    if (!exists) await repo.save(repo.create(r));
  }

  console.log(`✅ Seeded channels: ${rows.length}`);
}

async function seedMatches(ds: DataSource) {
  const repo = ds.getRepository(Match);

  // If you already have matches, do nothing (safe default).
  const count = await repo.count();
  if (count > 0) {
    console.log(`ℹ️ Matches already present (${count}), skipping match seed.`);
    return;
  }

  const rows: Array<Partial<Match>> = [
    {
      sport: 'cricket',
      title: 'India vs Australia • Ahmedabad',
      startsAt: daysFromNow(0),
      isLive: true,
      streamPlaybackUrl: null,
      chatEnabled: true,
      slowModeSeconds: 0,
    },
    {
      sport: 'football',
      title: 'Manchester City vs Liverpool • Premier League',
      startsAt: daysFromNow(1),
      isLive: false,
      streamPlaybackUrl: null,
      chatEnabled: true,
      slowModeSeconds: 0,
    },
    {
      sport: 'basketball',
      title: 'Lakers vs Warriors • NBA',
      startsAt: daysFromNow(2),
      isLive: false,
      streamPlaybackUrl: null,
      chatEnabled: true,
      slowModeSeconds: 0,
    },
  ];

  await repo.save(rows.map((r) => repo.create(r)));
  console.log(`✅ Seeded matches: ${rows.length}`);
}

async function seedNews(ds: DataSource) {
  const repo = ds.getRepository(NewsArticle);

  const rows: Array<Partial<NewsArticle>> = [
    {
      slug: 'historic-victory-young-squad',
      category: 'Breaking Story',
      sport: 'cricket',
      title:
        'Historic Victory: Underdogs Claim the Championship Title in Thrilling Finale',
      excerpt:
        'In a match remembered for decades, the team defied all odds to secure their first-ever major trophy.',
      content:
        'Full story placeholder. Replace with real editorial content.\n\nThis is seeded data for MVP.',
      publishedAt: new Date(),
      coverImageUrl: null,
      isPublished: true,
    },
    {
      slug: 'tactical-breakdown-derby',
      category: 'Analysis',
      sport: 'football',
      title: 'Match Analysis: Tactical Breakdown of the Derby',
      excerpt: 'Expert analysis bringing you closer to the action.',
      content: 'Full analysis placeholder. Replace with real content.',
      publishedAt: new Date(),
      coverImageUrl: null,
      isPublished: true,
    },
    {
      slug: 'transfer-window-top-moves',
      category: 'Transfers',
      sport: 'football',
      title: 'Transfer Window Updates: Top 5 Moves to Watch',
      excerpt: 'Key moves and rumors in the market.',
      content: 'Transfer story placeholder. Replace with real content.',
      publishedAt: new Date(),
      coverImageUrl: null,
      isPublished: true,
    },
  ];

  for (const r of rows) {
    const exists = await repo.findOne({ where: { slug: r.slug! } });
    if (!exists) await repo.save(repo.create(r));
  }

  console.log(`✅ Seeded news: ${rows.length}`);
}

async function seedHighlights(ds: DataSource) {
  const repo = ds.getRepository(Highlight);

  const rows: Array<Partial<Highlight>> = [
    {
      sport: 'cricket',
      matchId: null,
      title: "Kohli's Masterclass: Every Boundary from his 82*",
      videoUrl: null,
      durationSeconds: 8 * 60 + 45,
      views: 1250000,
      isTrending: true,
    },
    {
      sport: 'football',
      matchId: null,
      title: 'Top 10 Goals of the Month',
      videoUrl: null,
      durationSeconds: 10 * 60 + 24,
      views: 1200000,
      isTrending: true,
    },
    {
      sport: 'basketball',
      matchId: null,
      title: 'Insane Dunk Contest Highlights',
      videoUrl: null,
      durationSeconds: 5 * 60 + 12,
      views: 850000,
      isTrending: false,
    },
  ];

  // de-dupe by (sport,title)
  for (const r of rows) {
    const exists = await repo.findOne({
      where: { sport: r.sport!, title: r.title! },
    });
    if (!exists) await repo.save(repo.create(r));
  }

  console.log(`✅ Seeded highlights: ${rows.length}`);
}

async function seedEvents(ds: DataSource) {
  const repo = ds.getRepository(Event);

  const rows: Array<Partial<Event>> = [
    {
      title: 'World Cup Final 2026',
      description:
        'Join the event and compete for rewards (seeded placeholder).',
      sport: 'cricket',
      prize: '$1,000,000',
      joinedCount: 15420,
      isFeatured: true,
      startsAt: daysFromNow(1),
      endsAt: daysFromNow(2),
    },
    {
      title: 'NBA Finals Game Night',
      description: 'Watch party + community predictions (seeded placeholder).',
      sport: 'basketball',
      prize: '$3,000,000',
      joinedCount: 55000,
      isFeatured: true,
      startsAt: daysFromNow(5),
      endsAt: daysFromNow(6),
    },
  ];

  // de-dupe by title + startsAt date
  for (const r of rows) {
    const exists = await repo.findOne({
      where: { title: r.title! },
    });
    if (!exists) await repo.save(repo.create(r));
  }

  console.log(`✅ Seeded events: ${rows.length}`);
}

async function seedShop(ds: DataSource) {
  const repo = ds.getRepository(ShopItem);

  const rows: Array<Partial<ShopItem>> = [
    {
      sku: 'PREMIUM_JERSEY',
      name: 'Premium Jersey',
      imageUrl: null,
      pointsCost: 1200,
      stock: 50,
      isActive: true,
    },
    {
      sku: 'SIGNED_BALL',
      name: 'Signed Ball',
      imageUrl: null,
      pointsCost: 900,
      stock: 25,
      isActive: true,
    },
    {
      sku: 'VIP_TICKET',
      name: 'VIP Ticket',
      imageUrl: null,
      pointsCost: 3000,
      stock: 10,
      isActive: true,
    },
    {
      sku: 'TEAM_CAP',
      name: 'Team Cap',
      imageUrl: null,
      pointsCost: 450,
      stock: 100,
      isActive: true,
    },
  ];

  for (const r of rows) {
    const exists = await repo.findOne({ where: { sku: r.sku! } });
    if (!exists) await repo.save(repo.create(r));
  }

  console.log(`✅ Seeded shop items: ${rows.length}`);
}

async function main() {
  // Use same DB env vars as app.module.ts / create-admin.ts
  const ds = new DataSource({
    type: 'mysql',
    host: requiredEnv('DB_HOST'),
    port: Number(process.env.DB_PORT || 3306),
    username: requiredEnv('DB_USERNAME'),
    password: requiredEnv('DB_PASSWORD'),
    database: requiredEnv('DB_NAME'),
    entities: [
      User,
      Match,
      ChatMessage,
      AnalyticsEvent,
      Sport,
      Channel,
      NewsArticle,
      Highlight,
      Event,
      ShopItem,
    ],
    // Safe default: do NOT mutate schema from seed. Let the app create tables with synchronize:true.
    // If you want seeds to create tables too, run with: SEED_SYNC=true npm run seed
    synchronize: String(process.env.SEED_SYNC || '').toLowerCase() === 'true',
  });

  await ds.initialize();
  console.log('✅ DB connected');

  await seedSports(ds);
  await seedChannels(ds);
  await seedMatches(ds);
  await seedNews(ds);
  await seedHighlights(ds);
  await seedEvents(ds);
  await seedShop(ds);

  await ds.destroy();
  console.log('✅ Seed completed');
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
