import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { PricingModule } from './pricing/pricing.module';
import { ProjectsModule } from './projects/projects.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { PaymentsModule } from './payments/payments.module';
import { ContractsModule } from './contracts/contracts.module';
import { FieldOpsModule } from './field-ops/field-ops.module';
import { PayrollModule } from './payroll/payroll.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { SupportModule } from './support/support.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ContentModule } from './content/content.module';
import { ReportsModule } from './reports/reports.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ServicesModule,
    PricingModule,
    ProjectsModule,
    SchedulingModule,
    PaymentsModule,
    ContractsModule,
    FieldOpsModule,
    PayrollModule,
    NotificationsModule,
    FileStorageModule,
    SupportModule,
    PromotionsModule,
    ContentModule,
    ReportsModule,
    AuditModule,
  ],
})
export class AppModule {}
