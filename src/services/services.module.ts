import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { Service } from './entities/service.entity';
import { ServiceOption } from './entities/service-option.entity';
import { ServiceCategoriesService } from './service-categories.service';
import { ServicesService } from './services.service';
import { ServiceOptionsService } from './service-options.service';
import { ServiceCategoriesController } from './controllers/service-categories.controller';
import { ServicesController } from './controllers/services.controller';
import { ServiceOptionsController } from './controllers/service-options.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory, Service, ServiceOption])],
  providers: [ServiceCategoriesService, ServicesService, ServiceOptionsService],
  controllers: [ServiceCategoriesController, ServicesController, ServiceOptionsController],
  exports: [ServiceCategoriesService, ServicesService, ServiceOptionsService],
})
export class ServicesModule {}