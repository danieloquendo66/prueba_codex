import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectItem } from './entities/project-item.entity';
import { CreateProjectDto, CreateProjectItemDto } from './dto/create-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { PricingService } from '../pricing/pricing.service';
import { ServiceOption } from '../services/entities/service-option.entity';
import { Service } from '../services/entities/service.entity';
import { ProjectStatus } from './enums/project-status.enum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(ProjectItem)
    private readonly itemRepo: Repository<ProjectItem>,
    @InjectRepository(ServiceOption)
    private readonly optionRepo: Repository<ServiceOption>,
    private readonly pricingService: PricingService,
  ) {}

  async create(dto: CreateProjectDto, userId: string): Promise<Project> {
    const project = this.projectRepo.create({
      user: { id: userId } as any,
      status: ProjectStatus.QUOTED,
      items: [],
    });
    let total = 0;
    const items: ProjectItem[] = [];
    for (const it of dto.items) {
      const calc = await this.pricingService.calculate({
        serviceId: it.serviceId,
        area: it.area,
        optionIds: it.optionIds,
      });
      const options: ServiceOption[] = it.optionIds
        ? await this.optionRepo.find({ where: { id: In(it.optionIds) } })
        : [];
      const item = this.itemRepo.create({
        project,
        service: { id: it.serviceId } as Service,
        area: it.area,
        options,
        unitPrice: calc.basePrice,
        totalPrice: calc.totalPrice,
      });
      total += Number(calc.totalPrice);
      items.push(item);
    }
    project.items = items;
    project.totalPrice = total;
    return this.projectRepo.save(project);
  }

  async findAllForUser(userId: string): Promise<Project[]> {
    return this.projectRepo.find({
      where: { user: { id: userId } as any },
      relations: ['items', 'items.service', 'items.options'],
    });
  }

  async findOneForUser(id: string, userId: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id, user: { id: userId } as any },
      relations: ['items', 'items.service', 'items.options'],
    });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async updateStatus(
    id: string,
    dto: UpdateProjectStatusDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id }, relations: ['user'] });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    if (project.user.id !== userId) {
      throw new ForbiddenException('Forbidden');
    }
    project.status = dto.status;
    await this.projectRepo.save(project);
    return this.findOneForUser(id, userId);
  }
}