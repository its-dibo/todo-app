import { UserEntity } from '#api/users/entities/user.entity';

export class AuthResponseDto extends UserEntity {
  /**
   * a Bearer JWT token to be sent with subsequent requests to authorize the request
   * add it to the 'Authorization' header
   */
  access_token: string;
}
