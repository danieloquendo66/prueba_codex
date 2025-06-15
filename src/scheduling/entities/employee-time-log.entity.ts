import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Team } from './team.entity';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class EmployeeTimeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, team => team.timeLogs, { nullable: false })
  team: Team;

  @ManyToOne(() => User, user => user.id, { nullable: false })
  user: User;

  @ManyToOne(() => Project, { nullable: false })
  project: Project;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  startLat?: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  startLng?: number;

  @Column({ type: 'timestamptz', nullable: true })
  endTime?: Date;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  endLat?: number;

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  endLng?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}