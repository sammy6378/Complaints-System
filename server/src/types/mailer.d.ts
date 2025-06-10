export type sendEmailDto = {
  subject: string;
  recipients: string;
  template: string;
  data: Record<string, any>;
};
