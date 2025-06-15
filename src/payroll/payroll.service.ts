import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll } from './entities/payroll.entity';
import { Paystub } from './entities/paystub.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { EmployeeTimeLog } from '../scheduling/entities/employee-time-log.entity';
import { MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepo: Repository<Payroll>,
    @InjectRepository(Paystub)
    private paystubRepo: Repository<Paystub>,
    @InjectRepository(EmployeeTimeLog)
    private logRepo: Repository<EmployeeTimeLog>,
  ) {}

  async createPayroll(dto: CreatePayrollDto) {
    const { teamId, periodStart, periodEnd, hourlyRate } = dto;
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    if (end <= start) throw new BadRequestException('periodEnd must be after periodStart');
    const logs = await this.logRepo.find({
      where: {
        team: { id: teamId } as any,
        startTime: MoreThanOrEqual(start),
        endTime: LessThanOrEqual(end),
      },
    });
    let total = 0;
    const paystubs: Paystub[] = [];
    for (const log of logs) {
      const ms = log.endTime.getTime() - log.startTime.getTime();
      const hours = ms / (1000 * 60 * 60);
      const amount = Math.round(hours * hourlyRate * 100) / 100;
      total += amount;
      const stub = this.paystubRepo.create({
        payrollId: '', // assigned later
        timeLogId: log.id,
        hours,
        amount,
      });
      paystubs.push(stub);
    }
    total = Math.round(total * 100) / 100;
    const payroll = this.payrollRepo.create({ teamId, periodStart: start, periodEnd: end, totalAmount: total });
    const savedPayroll = await this.payrollRepo.save(payroll);
    for (const stub of paystubs) {
      stub.payrollId = savedPayroll.id;
      await this.paystubRepo.save(stub);
    }
    return this.getPayroll(savedPayroll.id);
  }

  async getPayroll(id: string) {
    const payroll = await this.payrollRepo.findOne({ where: { id } });
    if (!payroll) throw new BadRequestException(`Payroll ${id} not found`);
    const paystubs = await this.paystubRepo.find({ where: { payrollId: id } });
    return { payroll, paystubs };
  }
}