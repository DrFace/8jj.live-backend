import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  
  @Index()
  @Column({ type: 'varchar', length: 50 })
  sport: string; // cricket | football | basketball

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'datetime' })
  startsAt: Date;

  @Index()
  @Column({ type: 'boolean', default: false })
  isLive: boolean;

  // Your streaming provider identifiers (WebRTC/LL-HLS/etc.)
  @Column({ type: 'varchar', length: 255, nullable: true })
  streamPlaybackUrl: string | null;

  @Column({ type: 'boolean', default: true })
  chatEnabled: boolean;

  @Column({ type: 'int', default: 0 })
  slowModeSeconds: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
