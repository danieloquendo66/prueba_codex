// @ts-nocheck
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { UploadFileDto } from './dto/upload-file.dto';
import AWS from 'aws-sdk';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly s3: import('aws-sdk').S3;

  constructor() {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.s3 = new AWS.S3();
  }

  async uploadFile(dto: UploadFileDto): Promise<{ key: string; url: string }> {
    const key = `${Date.now()}_${dto.filename}`;
    this.logger.log(`Uploading file with key ${key}`);
    const buffer = Buffer.from(dto.contentBase64, 'base64');
    try {
      const result = await this.s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET || '',
          Key: key,
          Body: buffer,
          ContentType: dto.mimeType,
        })
        .promise();
      return { key, url: result.Location as string };
    } catch (err) {
      this.logger.error('S3 upload failed', err as any);
      throw new InternalServerErrorException('File upload failed');
    }
  }

  async getPresignedUrl(key: string): Promise<{ url: string }> {
    try {
      const url = this.s3.getSignedUrl('getObject', {
        Bucket: process.env.AWS_S3_BUCKET || '',
        Key: key,
        Expires: 3600,
      });
      return { url };
    } catch (err) {
      this.logger.error('S3 getPresignedUrl failed', err as any);
      throw new InternalServerErrorException('Could not generate url');
    }
  }

  async deleteFile(key: string): Promise<{ deleted: boolean }> {
    try {
      await this.s3
        .deleteObject({ Bucket: process.env.AWS_S3_BUCKET || '', Key: key })
        .promise();
      return { deleted: true };
    } catch (err) {
      this.logger.error('S3 delete failed', err as any);
      throw new InternalServerErrorException('File delete failed');
    }
  }
}