import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectPhoto } from './entities/project-photo.entity';
import { FieldOpsService } from './field-ops.service';
import { FieldOpsController } from './field-ops.controller';
import { EmployeeTimeLog } from '../scheduling/entities/employee-time-log.entity';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectPhoto, EmployeeTimeLog, Message, User, Project]),
  ],
  providers: [FieldOpsService],
  controllers: [FieldOpsController],
})
export class FieldOpsModule {}