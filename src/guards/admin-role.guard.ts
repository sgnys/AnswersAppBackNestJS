import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoles } from '../../types';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const { role } = request.user;
      console.log('role', role);

      return role === UserRoles.ADMIN;
    }
  }
}
