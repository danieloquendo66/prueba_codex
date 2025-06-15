import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Referral {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  referrerUserId: string;

  @Column()
  referredUserId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}