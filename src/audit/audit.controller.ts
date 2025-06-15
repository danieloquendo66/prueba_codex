import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('audit/logs')
export class AuditController {
  constructor(private readonly service: AuditService) {}

  @Get()
  getLogs() {
    return this.service.findAll();
  }
}