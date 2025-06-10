import { SetMetadata } from '@nestjs/common';
import { policyHandler } from '../interfaces/policy-handler.interface';

export const CHECK_POLICIES_KEY = 'check_policies';
export const checkpolicies = (...handlers: policyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
