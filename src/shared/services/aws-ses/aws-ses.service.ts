import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';

import { ApiConfigService } from '../api-config.service';
import type { SendEmailDto } from './dtos/send-email.dto';

@Injectable()
export class AwsSesService {
  constructor(private configService: ApiConfigService) {
    const awsSesConfig = configService.awsSesConfig;

    AWS.config.update({
      accessKeyId: awsSesConfig.accessKeyId,
      secretAccessKey: awsSesConfig.secretAccessKey,
      region: awsSesConfig.region,
    });
  }

  async sendEmail({
    to,
    ccAddress,
    subject,
    replyTo,
    html,
    text,
  }: SendEmailDto) {
    const params = {
      Destination: {
        CcAddresses: ccAddress ? [...ccAddress] : [],
        ToAddresses: [...to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'utf8',
            Data: html || '',
          },
          Text: {
            Charset: 'utf8',
            Data: text,
          },
        },
        Subject: {
          Charset: 'utf8',
          Data: subject,
        },
      },
      Source: process.env.AWS_SES_FROM_EMAIL || 'EMAIL_ADDRESS',
      ReplyToAddresses: replyTo ? [...replyTo] : [],
    };

    return new AWS.SES({ apiVersion: '2010-12-01' })
      .sendEmail(params)
      .promise();
  }
}
