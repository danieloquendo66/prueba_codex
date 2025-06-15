import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Paystub {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  payrollId: string;

  @Column()
  timeLogId: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  hours: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}