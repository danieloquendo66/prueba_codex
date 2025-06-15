import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectPhoto } from './entities/project-photo.entity';
import { CreateProjectPhotoDto } from './dto/create-project-photo.dto';
import { EmployeeTimeLog } from '../scheduling/entities/employee-time-log.entity';
import { CheckInDto } from './dto/check-in.dto';
import { CheckOutDto } from './dto/check-out.dto';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from '../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class FieldOpsService {
  constructor(
    @InjectRepository(ProjectPhoto)
    private readonly photoRepo: Repository<ProjectPhoto>,
    @InjectRepository(EmployeeTimeLog)
    private readonly logRepo: Repository<EmployeeTimeLog>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  createPhoto(dto: CreateProjectPhotoDto) {
    const photo = this.photoRepo.create(dto);
    return this.photoRepo.save(photo);
  }

  getPhotosByProject(projectId: string) {
    return this.photoRepo.find({ where: { projectId } });
  }
  
  async checkIn(userId: string, dto: CheckInDto) {
    const log = this.logRepo.create({
      user: { id: userId } as User,
      project: { id: dto.projectId } as Project,
      team: { id: dto.teamId } as any,
      startTime: new Date(),
      startLat: dto.latitude,
      startLng: dto.longitude,
    });
    return this.logRepo.save(log);
  }

  async checkOut(userId: string, id: string, dto: CheckOutDto) {
    const log = await this.logRepo.findOne({ where: { id }, relations: ['user'] });
    if (!log) throw new NotFoundException(`Log ${id} not found`);
    if (log.user.id !== userId) throw new ForbiddenException();
    log.endTime = new Date();
    log.endLat = dto.latitude;
    log.endLng = dto.longitude;
    return this.logRepo.save(log);
  }

  async getSchedule(userId: string) {
    return this.logRepo.find({ where: { user: { id: userId } }, relations: ['project', 'team'] });
  }

  async getScheduleById(userId: string, id: string) {
    const log = await this.logRepo.findOne({ where: { id, user: { id: userId } }, relations: ['project', 'team'] });
    if (!log) throw new NotFoundException(`Log ${id} not found`);
    return log;
  }

  async sendMessage(fromUserId: string, dto: SendMessageDto) {
    const msg = this.messageRepo.create({
      project: { id: dto.projectId } as Project,
      fromUser: { id: fromUserId } as User,
      toUser: { id: dto.toUserId } as User,
      content: dto.content,
    });
    return this.messageRepo.save(msg);
  }

  async getMessagesByProject(projectId: string) {
    return this.messageRepo.find({ where: { project: { id: projectId } }, relations: ['fromUser', 'toUser'] });
  }
}