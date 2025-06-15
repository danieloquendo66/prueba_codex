import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual, Not } from 'typeorm';
import { Team } from './entities/team.entity';
import { EmployeeTimeLog } from './entities/employee-time-log.entity';
import { TeamMember } from './entities/team-member.entity';
import { ScheduleProjectDto } from './dto/schedule-project.dto';
import { RescheduleDto } from './dto/reschedule.dto';

@Injectable()
export class SchedulingService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
    @InjectRepository(EmployeeTimeLog)
    private readonly logRepo: Repository<EmployeeTimeLog>,
    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
  ) {}

  // CRUD Teams
  createTeam(dto: import('./dto/create-team.dto').CreateTeamDto) {
    const team = this.teamRepo.create(dto);
    return this.teamRepo.save(team);
  }

  findAllTeams() {
    return this.teamRepo.find();
  }

  async findTeam(id: string) {
    const team = await this.teamRepo.findOneBy({ id });
    if (!team) throw new NotFoundException(`Team ${id} not found`);
    return team;
  }

  async updateTeam(id: string, dto: import('./dto/update-team.dto').UpdateTeamDto) {
    await this.findTeam(id);
    await this.teamRepo.update(id, dto);
    return this.findTeam(id);
  }

  async removeTeam(id: string) {
    await this.findTeam(id);
    await this.teamRepo.softDelete(id);
  }

  // Availability for a date (returns occupied slots per team)
  async getAvailability(date: string) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const logs = await this.logRepo.find({
      where: { startTime: Between(start, end) },
      relations: ['team'],
    });
    const result: Record<string, EmployeeTimeLog[]> = {};
    for (const log of logs) {
      const key = log.team.id;
      if (!result[key]) result[key] = [];
      result[key].push(log);
    }
    return result;
  }

  // Schedule a project
  async schedule(dto: ScheduleProjectDto) {
    const team = await this.findTeam(dto.teamId);
    // count overlapping logs
    const overlapping = await this.logRepo.count({
      where: {
        team: { id: team.id } as any,
        startTime: LessThanOrEqual(new Date(dto.endTime)),
        endTime: MoreThanOrEqual(new Date(dto.startTime)),
      },
    });
    if (overlapping >= team.capacity) {
      throw new ConflictException('No available slots for this team');
    }
    const log = this.logRepo.create({
      team: { id: team.id } as any,
      project: { id: dto.projectId } as any,
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
    });
    return this.logRepo.save(log);
  }

  // Reschedule
  async reschedule(id: string, dto: RescheduleDto) {
    const log = await this.logRepo.findOne({ where: { id }, relations: ['team'] });
    if (!log) throw new NotFoundException(`Schedule ${id} not found`);
    // check capacity
    const overlapping = await this.logRepo.count({
      where: {
        team: { id: log.team.id } as any,
        startTime: LessThanOrEqual(new Date(dto.endTime)),
        endTime: MoreThanOrEqual(new Date(dto.startTime)),
        id: Not(id),
      },
    });
    if (overlapping >= log.team.capacity) {
      throw new ConflictException('No available slots for this team');
    }
    log.startTime = new Date(dto.startTime);
    log.endTime = new Date(dto.endTime);
    return this.logRepo.save(log);
  }

  // Cancel schedule
  async cancel(id: string) {
    await this.logRepo.findOneBy({ id });
    await this.logRepo.softDelete(id);
  }
  
  // Team Members Management
  async addTeamMember(
    teamId: string,
    dto: import('./dto/create-team-member.dto').CreateTeamMemberDto,
  ) {
    const team = await this.findTeam(teamId);
    const member = this.memberRepo.create({
      team: { id: team.id } as any,
      user: { id: dto.userId } as any,
      role: dto.role,
    });
    return this.memberRepo.save(member);
  }

  async listTeamMembers(teamId: string) {
    await this.findTeam(teamId);
    return this.memberRepo.find({ where: { team: { id: teamId } }, relations: ['user'] });
  }

  async updateTeamMember(
    teamId: string,
    memberId: string,
    dto: import('./dto/update-team-member.dto').UpdateTeamMemberDto,
  ) {
    const member = await this.memberRepo.findOne({ where: { id: memberId, team: { id: teamId } } });
    if (!member) throw new NotFoundException(`TeamMember ${memberId} not found`);
    Object.assign(member, dto);
    return this.memberRepo.save(member);
  }

  async removeTeamMember(teamId: string, memberId: string) {
    const member = await this.memberRepo.findOne({ where: { id: memberId, team: { id: teamId } } });
    if (!member) throw new NotFoundException(`TeamMember ${memberId} not found`);
    await this.memberRepo.softDelete(memberId);
  }
}