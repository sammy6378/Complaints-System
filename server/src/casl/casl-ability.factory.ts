import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Action } from './action.enum';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UserRole } from 'src/users/dto/create-user.dto';

type Subject =
  | 'User'
  | 'Admin'
  | 'Complain'
  | 'Category'
  | 'State'
  | 'UserLog'
  | 'AdminLog'
  | 'All';

export type AppAbility = PureAbility<[Action, Subject]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User): AppAbility {
    const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

    // admin permissions
    if (user.role === UserRole.ADMIN) {
      can(Action.Manage, 'All'); // Admin can manage everything
    }

    // user permissions
    if (user.role === UserRole.USER) {
      can(Action.Read, ['Category', 'Complain', 'State']);
      can(Action.Create, 'Complain');
      can(Action.Update, ['Complain', 'User']);
    }

    return build();
  }
}
