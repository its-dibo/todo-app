import { ApiHideProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export class BasicEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiHideProperty()
  id: string;

  @CreateDateColumn()
  @ApiHideProperty()
  created_at: Date;

  @UpdateDateColumn()
  @ApiHideProperty()
  updated_at: Date;

  /**
   * for soft delete
   */
  @DeleteDateColumn()
  @ApiHideProperty()
  deleted_at: Date;

  /**
   * the version number of the updated row
   * @example 1
   */
  @VersionColumn()
  @ApiHideProperty()
  _version: number;
}

/**
 * a class represents a schema response as {data, count}
 *
 * @example  @ApiOkResponse({ type: EntityWithCount<UserEntity> })
 */
// this must be defined inside a `*.entity.ts` file to make @nestjs/swagger recognize it
export class EntityWithCount<T> {
  data: T[];
  count: number;
}
