import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProjectItem } from './project-item.entity';
import { ProjectStatus } from '../enums/project-status.enum';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @OneToMany(() => ProjectItem, item => item.project, { cascade: true })
  items: ProjectItem[];

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.QUOTED,
  })
  status: ProjectStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}