// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from './notification.entity';
import { SendNotificationDto } from './dto/send-notification.dto';
import AWS from 'aws-sdk';
import * as Twilio from 'twilio';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  private ses: AWS.SES;
  private twilioClient: Twilio.Twilio;

  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {
    // AWS SES
    AWS.config.update({ region: process.env.AWS_REGION });
    this.ses = new AWS.SES();
    // Twilio
    this.twilioClient = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    // Firebase Admin
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}',
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }

  async send(dto: SendNotificationDto): Promise<Notification> {
    const notification = this.repo.create({
      type: dto.type,
      recipient: dto.recipient,
      payload: dto.payload,
      status: NotificationStatus.PENDING,
    });
    const saved = await this.repo.save(notification);

    try {
      switch (dto.type) {
        case NotificationType.EMAIL:
          await this.ses
            .sendEmail({
              Source: process.env.AWS_SES_FROM_EMAIL || '',
              Destination: { ToAddresses: [dto.recipient] },
              Message: {
                Subject: { Data: 'Notification' },
                Body: { Text: { Data: dto.payload } },
              },
            })
            .promise();
          break;
        case NotificationType.SMS:
          await this.twilioClient.messages.create({
            body: dto.payload,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: dto.recipient,
          });
          break;
        case NotificationType.PUSH:
          await admin.messaging().send({
            notification: { title: 'Notification', body: dto.payload },
            token: dto.recipient,
          });
          break;
      }
      saved.status = NotificationStatus.SENT;
    } catch (err) {
      this.logger.error('Notification send failed', err as any);
      saved.status = NotificationStatus.FAILED;
    }
    await this.repo.save(saved);
    return saved;
  }
}