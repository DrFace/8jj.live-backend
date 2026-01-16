import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('highlights')
export class Highlight {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  sport: string;

  @Index()
  @Column({ type: 'int', nullable: true })
  matchId: number | null;

  @Column({ type: 'varchar', length: 220 })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  videoUrl: string | null;

  @Column({ type: 'int', default: 0 })
  durationSeconds: number;

  @Column({ type: 'bigint', default: 0 })
  views: number;

  @Index()
  @Column({ type: 'boolean', default: false })
  isTrending: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
