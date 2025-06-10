import { AppAbility } from '../casl-ability.factory';

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

export type policyHandler = IPolicyHandler | ((ability: AppAbility) => boolean);
