import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RBAC } from '../decorator/rbac.decorator';
import { Role } from 'src/user/entities/user.entity';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<Role>(RBAC, context.getHandler());

    if (!Object.values(Role).includes(role)) return true; // 이거 수정 필요

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    return user.role <= role; // 권한 레벨 true/false. role index 순서대로 높은 권한 설정해놓았음
  }
}
