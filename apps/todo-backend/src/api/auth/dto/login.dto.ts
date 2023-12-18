import { UserEntity } from '#api/users/entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class LoginDto extends PickType(UserEntity, ['email', 'password']) {}
