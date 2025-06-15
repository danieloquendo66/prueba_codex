import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './entities/payroll.entity';
import { Paystub } from './entities/paystub.entity';
import { EmployeeTimeLog } from '../scheduling/entities/employee-time-log.entity';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, Paystub, EmployeeTimeLog]),
  ],
  providers: [PayrollService],
  controllers: [PayrollController],
})
export class PayrollModule {}