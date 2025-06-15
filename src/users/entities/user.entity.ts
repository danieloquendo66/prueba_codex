import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserRole } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  telefono: string;

  @Column({ nullable: true })
  foto?: string;

  @Column({ unique: true })
  ssn: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
  /** SMS verification status */
  @Column({ default: false })
  phoneVerified: boolean;
  /** Current verification code */
  @Column({ nullable: true })
  phoneVerificationCode?: string;
  /** Code expiration timestamp */
  @Column({ type: 'timestamp', nullable: true })
  phoneVerificationCodeExpiresAt?: Date;
}