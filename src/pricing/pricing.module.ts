import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  providers: [PricingService],
  controllers: [PricingController],
})
export class PricingModule {}