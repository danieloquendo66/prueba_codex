import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectItem } from './entities/project-item.entity';
import { ServiceOption } from '../services/entities/service-option.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectItem, ServiceOption]),
    PricingModule,
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}