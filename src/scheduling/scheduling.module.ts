import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { EmployeeTimeLog } from './entities/employee-time-log.entity';
import { TeamMember } from './entities/team-member.entity';
import { SchedulingService } from './scheduling.service';
import { TeamsController, SchedulingController } from './scheduling.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Team, EmployeeTimeLog, TeamMember])],
  providers: [SchedulingService],
  controllers: [TeamsController, SchedulingController],
  exports: [SchedulingService],
})
export class SchedulingModule {}