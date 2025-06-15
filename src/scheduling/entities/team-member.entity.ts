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
import { User } from '../../users/entities/user.entity';
import { TeamRole } from '../enums/team-role.enum';

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team, team => team.members, { nullable: false })
  team: Team;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'enum', enum: TeamRole })
  role: TeamRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}