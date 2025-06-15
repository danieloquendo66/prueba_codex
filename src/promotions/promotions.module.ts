import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Referral } from './entities/referral.entity';
import { LoyaltyStatus } from './entities/loyalty-status.entity';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon, Referral, LoyaltyStatus])],
  providers: [PromotionsService],
  controllers: [PromotionsController],
})
export class PromotionsModule {}