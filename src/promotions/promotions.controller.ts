import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CreateReferralDto } from './dto/create-referral.dto';
import { CreateLoyaltyStatusDto } from './dto/create-loyalty-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly service: PromotionsService) {}

  // Coupons
  @Post('coupons')
  createCoupon(@Body() dto: CreateCouponDto) {
    return this.service.createCoupon(dto);
  }
  @Get('coupons/:code')
  getCoupon(@Param('code') code: string) {
    return this.service.getCoupon(code);
  }

  // Referrals
  @Post('referrals')
  createReferral(@Body() dto: CreateReferralDto) {
    return this.service.createReferral(dto);
  }
  @Get('referrals/:userId')
  getReferrals(@Param('userId') userId: string) {
    return this.service.getReferralsByUser(userId);
  }

  // Loyalty
  @Post('loyalty')
  createLoyalty(@Body() dto: CreateLoyaltyStatusDto) {
    return this.service.createLoyalty(dto);
  }
  @Get('loyalty/:userId')
  getLoyalty(@Param('userId') userId: string) {
    return this.service.getLoyalty(userId);
  }
}