import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio.Twilio;
  private from: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!accountSid || !authToken || !fromNumber) {
      throw new InternalServerErrorException('Twilio configuration is missing');
    }
    this.client = Twilio(accountSid, authToken);
    this.from = fromNumber;
  }

  async sendSms(to: string, body: string): Promise<void> {
    try {
      await this.client.messages.create({
        body,
        from: this.from,
        to,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to send SMS');
    }
  }
}