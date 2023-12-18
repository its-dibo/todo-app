import { TodoEntity } from '#api/todo/entities/todo.entity';
import { BasicEntity } from '#dto/basic.entity';
import { ApiHideProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, Matches } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum UserRole {
  /**
   * the system admin that has the most privileges to manage the system itself
   * for example he can modify any user
   */
  ADMIN = 'system admin',
}

@Entity('users')
export class UserEntity extends BasicEntity {
  /**
   * @example John
   */
  @Column({ nullable: false })
  firstName: string;

  /**
   * @example "David"
   */
  @Column({ nullable: false })
  lastName: string;

  fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * @example john.david@gmail.com
   */
  // todo: generate a random example: john.david.rand()@gmail.com
  // https://stackoverflow.com/questions/69177175/dynamically-inject-content-into-jsdoc-example
  // https://stackoverflow.com/questions/37683574/can-i-have-variables-inside-of-jsdoc
  @Column({ unique: true })
  @IsEmail()
  email: string;

  /**
   * the mobile number including the country code
   * @example +14844731795
   */
  // todo: issue: validations are ignored https://github.com/nestjs/swagger/issues/2698
  @Column({ unique: true })
  @IsMobilePhone()
  @Matches(/^\+/)
  mobile: string;

  /**
   * @example 'P@sSwrd!'
   */
  // todo: length for the encrypted pass
  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: undefined, nullable: true })
  // hide this property from Swagger UI to prevent creating system admin accounts
  @ApiHideProperty()
  role: UserRole;

  @OneToMany(() => TodoEntity, (post) => post.user)
  @ApiHideProperty()
  todos: TodoEntity[];
}

export class PartialUserEntity extends PartialType(UserEntity) {}

export class UserResponse extends OmitType(UserEntity, ['password']) {}

export class UsersWithCount {
  data: UserResponse[];
  count: number;
}
