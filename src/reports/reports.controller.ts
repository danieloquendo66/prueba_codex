import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('financial')
  getFinancial() {
    return this.service.getFinancialReport();
  }

  @Get('operational')
  getOperational() {
    return this.service.getOperationalReport();
  }

  @Get('performance')
  getPerformance() {
    return this.service.getPerformanceReport();
  }
}