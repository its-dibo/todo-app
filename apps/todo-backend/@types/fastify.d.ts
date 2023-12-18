import { JwtUser } from '#api/auth/auth.service';
import { Roles } from '#api/users/entities/user.entity';
import fastify from 'fastify';

declare module 'fastify' {
  export interface FastifyRequest {
    user: JwtUser;
  }
}
