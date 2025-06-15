import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ScheduleProjectDto } from './dto/schedule-project.dto';
import { RescheduleDto } from './dto/reschedule.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('teams')
export class TeamsController {
  constructor(private readonly service: SchedulingService) {}

  @Post()
  create(@Body() dto: CreateTeamDto) {
    return this.service.createTeam(dto);
  }

  @Get()
  findAll() {
    return this.service.findAllTeams();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findTeam(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.service.updateTeam(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.removeTeam(id);
  }
  
  @Post(':id/members')
  addMember(
    @Param('id') teamId: string,
    @Body() dto: import('./dto/create-team-member.dto').CreateTeamMemberDto,
  ) {
    return this.service.addTeamMember(teamId, dto);
  }

  @Get(':id/members')
  listMembers(@Param('id') teamId: string) {
    return this.service.listTeamMembers(teamId);
  }

  @Patch(':teamId/members/:memberId')
  updateMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @Body() dto: import('./dto/update-team-member.dto').UpdateTeamMemberDto,
  ) {
    return this.service.updateTeamMember(teamId, memberId, dto);
  }

  @Delete(':teamId/members/:memberId')
  removeMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.service.removeTeamMember(teamId, memberId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly service: SchedulingService) {}

  @Get('availability')
  getAvailability(@Query('date') date: string) {
    return this.service.getAvailability(date);
  }

  @Post('schedule')
  schedule(@Body() dto: ScheduleProjectDto) {
    return this.service.schedule(dto);
  }

  @Patch('schedule/:id/reschedule')
  reschedule(@Param('id') id: string, @Body() dto: RescheduleDto) {
    return this.service.reschedule(id, dto);
  }

  @Delete('schedule/:id')
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }
}