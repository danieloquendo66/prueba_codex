import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(action: string, userId: string, metadata?: any): Promise<AuditLog> {
    const log = this.repo.create({ action, userId, metadata });
    return this.repo.save(log);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.repo.find({ order: { timestamp: 'DESC' } });
  }
}