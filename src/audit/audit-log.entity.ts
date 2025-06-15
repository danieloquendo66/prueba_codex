import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column()
  userId: string;

  @Column('json', { nullable: true })
  metadata?: any;

  @CreateDateColumn({ name: 'timestamp' })
  timestamp: Date;
}