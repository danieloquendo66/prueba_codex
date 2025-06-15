import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { EmployeeTimeLog } from './employee-time-log.entity';
import { TeamMember } from './team-member.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'int', default: 1 })
  capacity: number;

  @OneToMany(() => EmployeeTimeLog, log => log.team)
  timeLogs: EmployeeTimeLog[];

  @OneToMany(() => TeamMember, member => member.team, { cascade: true })
  members: TeamMember[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}