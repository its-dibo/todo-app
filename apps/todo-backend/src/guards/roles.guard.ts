import { UserRole } from '#api/users/entities/user.entity';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * only provided roles can access the endpoint
 * the guard for each endpoint overrides the controller's guard
 *
 * @example @Roles('admin', 'moderator') -> user's that has role==="admin" can access
 *
 */
// or use @SetMetadata('roles', values)
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

/**
 * every user can access only his own data,
 * except the system admin who can access any data in this endpoint
 *
 * for example, if `@Own('author')` is set before `findAll()` it converted into `findAll({author: userId})`
 * to limit the results for data that he owns
 *
 * to disable this guard for a specific endpoint, i.e. to bypass the controller's value use `@Own(false)`
 *
 * @example @Own('user')
 *
 * @param field the field name that specify the document owner in the database, default=user.
 *   if set to false, it disables the guard
 */
// todo: @Limit('criteria' | {field: value})
// todo: create an interceptor to add this condition to the controller's handler
// todo: @Own(field, excludeRoles=['admin'])
export const Own = (field: string | false = 'user') =>
  SetMetadata('own', field);

/**
 * a guard that limits the access to specific roles that are provided by @Roles()
 * only the users that have one of the provided roles can access the resource
 *
 * @example
 *  @Get()
 *  @Roles('admin', 'moderator')
 *  findAll(){ return this.service.getAll(); }
 *
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    let roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      ctx.getClass(),
      ctx.getHandler(),
    ]);

    // if no role provided, then the resource access is not limited
    if (!roles?.length) {
      return true;
    }
    let req = ctx.switchToHttp().getRequest(),
      user = req.user;
    return roles.includes(user?.role);
  }
}
