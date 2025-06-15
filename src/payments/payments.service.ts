import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// @ts-ignore
import Stripe from 'stripe';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    this.stripe = new Stripe(stripeSecret, { apiVersion: '2022-11-15' });
  }

  async createPaymentIntent(dto: CreatePaymentIntentDto) {
    const { projectId, amount, currency } = dto;
    const payment = this.paymentsRepository.create({
      projectId,
      amount,
      currency,
      status: PaymentStatus.PENDING,
    });
    await this.paymentsRepository.save(payment);

    const intent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { paymentId: payment.id, projectId },
    });

    payment.stripePaymentIntentId = intent.id;
    await this.paymentsRepository.save(payment);

    return {
      clientSecret: intent.client_secret,
      paymentId: payment.id,
    };
  }

  async handleStripeWebhook(signature: string, payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error('Stripe webhook signature verification failed.', err);
      throw err;
    }

    if (
      event.type === 'payment_intent.succeeded' ||
      event.type === 'payment_intent.payment_failed'
    ) {
      const data = event.data.object as Stripe.PaymentIntent;
      const paymentId = data.metadata.paymentId as string;
      const payment = await this.paymentsRepository.findOne({ where: { id: paymentId } });
      if (payment) {
        if (event.type === 'payment_intent.succeeded') {
          payment.status = PaymentStatus.SUCCEEDED;
        } else {
          payment.status = PaymentStatus.FAILED;
        }
        await this.paymentsRepository.save(payment);
      }
    }

    return { received: true };
  }

  async findByProject(projectId: string): Promise<Payment[]> {
    return this.paymentsRepository.find({ where: { projectId } });
  }
}