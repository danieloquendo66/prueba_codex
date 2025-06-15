import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Payment } from '../payments/entities/payment.entity';
import { Payroll } from '../payroll/entities/payroll.entity';
import { Project } from '../projects/entities/project.entity';
import { EmployeeTimeLog } from '../scheduling/entities/employee-time-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Payroll,
      Project,
      EmployeeTimeLog,
    ]),
  ],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}