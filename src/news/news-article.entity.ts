import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('news_articles')
export class NewsArticle {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 190 })
  slug: string;

  @Index()
  @Column({ type: 'varchar', length: 80 })
  category: string; // Breaking Story, Cricket, Football, etc.

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  sport: string | null;

  @Column({ type: 'varchar', length: 220 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  excerpt: string;

  @Column({ type: 'longtext' })
  content: string;

  @Index()
  @Column({ type: 'datetime' })
  publishedAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
