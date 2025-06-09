import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';
import * as ejs from 'ejs';
import { sendEmailDto } from 'src/types/mailer';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}
  // transporter
  mailTransporter() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      logger: true,
      debug: true,
    });
    return transporter;
  }

  //   template to be used to send emails more to one recipient
  template(html: string, data: Record<string, string>) {
    return html.replace(/%(\w*)%/g, function (m, key: string) {
      return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : '';
    });
  }

  async sendEmail(dto: sendEmailDto) {
    const { recipients, subject, template, data } = dto;

    // const html = dto.placeholders
    //   ? this.template(dto.html, dto.placeholders)
    //   : dto.html;

    const templatePath = path.join(__dirname, '../mails', template);
    const html: string = await ejs.renderFile(templatePath, data);

    const transport = this.mailTransporter();

    const options: Mail.Options = {
      from: this.configService.get<string>('SMTP_EMAIL'),
      to: recipients,
      subject,
      html,
    };

    try {
      const res = await transport.sendMail(options);
      if (!res) {
        throw new Error('Unable to process the request');
      }
      return res;
    } catch (error) {
      console.log(error);
      throw new Error('Unable to process the request');
    }
  }
}
