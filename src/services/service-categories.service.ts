import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly repo: Repository<ServiceCategory>,
  ) {}

  async create(dto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const cat = this.repo.create(dto);
    return this.repo.save(cat);
  }

  findAll(): Promise<ServiceCategory[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<ServiceCategory> {
    const cat = await this.repo.findOneBy({ id });
    if (!cat) throw new NotFoundException(`Category ${id} not found`);
    return cat;
  }

  async update(id: string, dto: UpdateServiceCategoryDto): Promise<ServiceCategory> {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repo.softDelete(id);
  }
}