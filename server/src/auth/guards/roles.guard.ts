import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context
      .switchToHttp()
      .getRequest<{ user: { role: string } }>();
    const user = request.user;

    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}
