import { UserEntity } from '#api/users/entities/user.entity';
import { BasicEntity } from '#dto/basic.entity';
import { ApiHideProperty, PartialType } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('todo')
export class TodoEntity extends BasicEntity {
  /**
   * The todo's content
   * accepts HTML string
   *
   * @example '<b>important</b> note.'
   */
  @Column({ type: 'text' })
  content: string;

  /**
   * @example ["task","work"]
   */
  @Column({ array: true, type: 'varchar', nullable: true })
  labels: string[];

  @ManyToOne(() => UserEntity, (users) => users.todos)
  @ApiHideProperty()
  user: UserEntity;
}

export class PartialTodoEntity extends PartialType(TodoEntity) {
  content: string;
}

export class PostsWithCount {
  data: TodoEntity[];
  count: number;
}
