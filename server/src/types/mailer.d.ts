import { Address } from 'nodemailer/lib/mailer';

export type sendEmailDto = {
  subject: string;
  recipients: Address[];
  template: string;
  data: Record<string, any>;
};
