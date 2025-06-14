import { sendEmailDto } from 'src/types/mailer';

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendEmail({ recipients, subject, template, data }: sendEmailDto) {
    await this.mailer.sendMail({
      to: recipients,
      subject,
      template, // no .ejs extension
      context: data,
      // `from` comes from the defaults we set in MailerModule
    });
  }
}

// @Injectable()
// export class MailService {
//   constructor(private readonly configService: ConfigService) {}

//   // transporter
//   async sendEmail(dto: sendEmailDto) {
//     const { recipients, subject, template, data } = dto;

//     const transporter = nodemailer.createTransport({
//       host: this.configService.get<string>('SMTP_HOST'),
//       port: this.configService.get<number>('SMTP_PORT'),
//       secure: false,
//       auth: {
//         user: this.configService.get<string>('SMTP_USER'),
//         pass: this.configService.get<string>('SMTP_PASS'),
//       },
//       logger: true,
//       debug: true,
//     });

//     //   template to be used to send emails more to one recipient
//     // template(html: string, data: Record<string, string>) {
//     //   return html.replace(/%(\w*)%/g, function (m, key: string) {
//     //     return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : '';
//     //   });
//     // }

//     // const html = dto.placeholders
//     //   ? this.template(dto.html, dto.placeholders)
//     //   : dto.html;

//     // const templatePath = path.join(__dirname, '../mails', template);
//     const templatePath = join(process.cwd(), 'views', template);
//     const html: string = await ejs.renderFile(templatePath, data);

//     const options: Mail.Options = {
//       from: this.configService.get<string>('SMTP_EMAIL'),
//       to: recipients,
//       subject,
//       html,
//     };

//     await transporter.sendMail(options);
//   }
// }
