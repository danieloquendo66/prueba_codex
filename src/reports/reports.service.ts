import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Payroll } from '../payroll/entities/payroll.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectStatus } from '../projects/enums/project-status.enum';
import { EmployeeTimeLog } from '../scheduling/entities/employee-time-log.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(EmployeeTimeLog)
    private readonly logRepo: Repository<EmployeeTimeLog>,
  ) {}

  async getFinancialReport() {
    const revenueResult = await this.paymentRepo
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'revenue')
      .where('payment.status = :status', { status: PaymentStatus.SUCCEEDED })
      .getRawOne<{ revenue: string }>();
    const revenue = Number(revenueResult?.revenue ?? 0);

    const expenseResult = await this.payrollRepo
      .createQueryBuilder('payroll')
      .select('SUM(payroll.totalAmount)', 'expenses')
      .getRawOne<{ expenses: string }>();
    const expenses = Number(expenseResult?.expenses ?? 0);

    const profit = Math.round((revenue - expenses) * 100) / 100;
    return { revenue, expenses, profit };
  }

  async getOperationalReport() {
    const total = await this.projectRepo.count();
    const completed = await this.projectRepo.count({
      where: { status: ProjectStatus.COMPLETED },
    });
    const pending = total - completed;
    return { projects: total, completed, pending };
  }

  async getPerformanceReport() {
    const logs = await this.logRepo.find({ relations: ['project', 'team'] });
    if (logs.length === 0) {
      return { averageHoursPerProject: 0, utilizationRate: 0 };
    }

    let totalHours = 0;
    const projectIds = new Set<string>();
    const teamSet = new Set<string>();
    for (const log of logs) {
      if (log.project) {
        projectIds.add(log.project.id);
      }
      if (log.team) {
        // @ts-ignore - teamId column exists in database
        teamSet.add(log.team.id);
      }
      if (log.startTime && log.endTime) {
        const ms = log.endTime.getTime() - log.startTime.getTime();
        totalHours += ms / 3_600_000;
      }
    }

    const averageHoursPerProject =
      projectIds.size > 0 ? totalHours / projectIds.size : 0;

    const utilizationRate =
      teamSet.size > 0 ? totalHours / (teamSet.size * 8) : 0;

    return {
      averageHoursPerProject: Number(averageHoursPerProject.toFixed(2)),
      utilizationRate: Number(utilizationRate.toFixed(2)),
    };
  }
}
