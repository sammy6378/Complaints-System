import { Address } from 'nodemailer/lib/mailer';

export type sendEmailDto = {
  recipients: Address[];
  subject: string;
  template: string;
  data: Record<string, any>;
};
