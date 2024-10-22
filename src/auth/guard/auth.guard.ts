import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Public } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get(Public, context.getHandler());
    if (isPublic) return true;

    const requset = context.switchToHttp().getRequest();

    if (!requset.user || requset.user.type !== 'access') {
      return false;
    }

    return true;
  }
}
