import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
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
    const payments = await this.paymentRepo.find({
      where: { status: PaymentStatus.SUCCEEDED },
    });
    const revenue = payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
    const payrolls = await this.payrollRepo.find();
    const expenses = payrolls.reduce(
      (sum, p) => sum + Number(p.totalAmount),
      0,
    );
    const profit = revenue - expenses;
    return { revenue, expenses, profit };
  }

  async getOperationalReport() {
    const total = await this.projectRepo.count();
    const completed = await this.projectRepo.count({
      where: { status: ProjectStatus.COMPLETED },
    });
    const pending = await this.projectRepo.count({
      where: { status: Not(ProjectStatus.COMPLETED) },
    });
    return { projects: total, completed, pending };
  }

  async getPerformanceReport() {
    const logs = await this.logRepo.find({
      where: { endTime: Not(null) },
      relations: ['project', 'team'],
    });
    let totalHours = 0;
    const projectIds = new Set<string>();
    const teamDays = new Set<string>();
    for (const log of logs) {
      const hours =
        ((log.endTime as Date).getTime() - log.startTime.getTime()) /
        (1000 * 60 * 60);
      totalHours += hours;
      projectIds.add(log.project.id);
      const dayKey = `${log.team.id}-${log.startTime.toISOString().slice(0, 10)}`;
      teamDays.add(dayKey);
    }
    const averageHoursPerProject =
      projectIds.size > 0 ? totalHours / projectIds.size : 0;
    const utilizationRate =
      teamDays.size > 0 ? (totalHours / (teamDays.size * 8)) * 100 : 0;
    return { averageHoursPerProject, utilizationRate };
  }
}
