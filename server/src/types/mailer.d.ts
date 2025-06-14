export type sendEmailDto = {
  subject: string;
  recipients: string | string[];
  template: string;
  data: Record<string, any>;
};
