import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { Referral } from './entities/referral.entity';
import { LoyaltyStatus } from './entities/loyalty-status.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CreateReferralDto } from './dto/create-referral.dto';
import { CreateLoyaltyStatusDto } from './dto/create-loyalty-status.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepo: Repository<Coupon>,
    @InjectRepository(Referral)
    private readonly referralRepo: Repository<Referral>,
    @InjectRepository(LoyaltyStatus)
    private readonly loyaltyRepo: Repository<LoyaltyStatus>,
  ) {}

  // Coupons
  createCoupon(dto: CreateCouponDto) {
    const coupon = this.couponRepo.create(dto);
    return this.couponRepo.save(coupon);
  }
  async getCoupon(code: string) {
    const coupon = await this.couponRepo.findOne({ where: { code } });
    if (!coupon) throw new NotFoundException(`Coupon ${code} not found`);
    return coupon;
  }

  // Referrals
  createReferral(dto: CreateReferralDto) {
    const ref = this.referralRepo.create(dto);
    return this.referralRepo.save(ref);
  }
  getReferralsByUser(userId: string) {
    return this.referralRepo.find({ where: { referrerUserId: userId } });
  }

  // LoyaltyStatus
  createLoyalty(dto: CreateLoyaltyStatusDto) {
    const ls = this.loyaltyRepo.create(dto);
    return this.loyaltyRepo.save(ls);
  }
  getLoyalty(userId: string) {
    return this.loyaltyRepo.findOne({ where: { userId } });
  }
}