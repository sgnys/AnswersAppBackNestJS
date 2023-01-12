import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    console.log('context', context.getHandler().name);
    console.log('roles', roles);

    const request = context.switchToHttp().getRequest();

    if (request?.user) {
      const { role } = request.user;
      console.log('role', role);

      return roles.includes(role);
    }
  }
}
