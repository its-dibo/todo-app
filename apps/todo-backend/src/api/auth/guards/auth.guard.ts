import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'local']) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    let isPublic = this.reflector.getAllAndOverride<boolean>(
      'isPublicEndPoint',
      [context.getHandler(), context.getClass()]
    );

    return isPublic || super.canActivate(context);
  }

  handleRequest<UserEntity>(err: Error, user: UserEntity, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

/**
 * attach this decorator to public endpoints to exclude them from the auth guard
 * @returns
 */
export const Public = () => SetMetadata('isPublicEndPoint', true);
export const Private = () => SetMetadata('isPublicEndPoint', false);
