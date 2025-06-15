import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('payroll')
export class PayrollController {
  constructor(private readonly service: PayrollService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: any, @Body() dto: CreatePayrollDto) {
    // Optionally verify user role or ownership here
    return this.service.createPayroll(dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async get(@CurrentUser() user: any, @Param('id') id: string) {
    // Optionally verify user authorization here
    return this.service.getPayroll(id);
  }
}