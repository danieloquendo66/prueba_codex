import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { Service } from '../../services/entities/service.entity';
import { ServiceOption } from '../../services/entities/service-option.entity';

@Entity()
export class ProjectItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, project => project.items, { nullable: false })
  project: Project;

  @ManyToOne(() => Service, { eager: true })
  service: Service;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  area: number;

  @ManyToMany(() => ServiceOption, { eager: true })
  @JoinTable()
  options: ServiceOption[];

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}