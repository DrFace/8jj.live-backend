import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 220 })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  sport: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  prize: string | null;

  @Column({ type: 'int', default: 0 })
  joinedCount: number;

  @Index()
  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Index()
  @Column({ type: 'datetime' })
  startsAt: Date;

  @Column({ type: 'datetime', nullable: true })
  endsAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
