import { JwtUser } from '#api/auth/auth.service';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

// todo: User<T>
export const User = createParamDecorator(
  (prop: keyof JwtUser, ctx: ExecutionContext) => {
    let req = ctx.switchToHttp().getRequest() as FastifyRequest;
    return prop ? req.user?.[prop] : req.user;
  },
);
