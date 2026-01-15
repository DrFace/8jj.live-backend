import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('analytics_events')
export class AnalyticsEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  matchId: number;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  type: string; // viewer_join, viewer_leave, chat_message, etc.

  @Index()
  @Column({ type: 'int', nullable: true })
  userId: number | null;

  @Column({ type: 'json', nullable: true })
  meta: any;

  @CreateDateColumn()
  createdAt: Date;
}
