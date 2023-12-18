import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import { JwtUser } from '#api/auth/auth.service';
import { findAndCount } from '#shared/database';
import { Obj } from '#types';
import { PartialTodoEntity, TodoEntity } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private repo: Repository<TodoEntity>,
  ) {}

  create(data: TodoEntity, user: JwtUser) {
    return this.repo
      .insert({
        ...data,
        user: { id: user.sub },
      })
      .then((res) => (Array.isArray(data) ? res?.raw : res?.raw[0]));
  }

  updateById(id: string, data: PartialTodoEntity) {
    return this.repo
      .update({ id }, data)
      .then((res) => ({ affected: res.affected }));
  }

  findAll(queries?: Obj) {
    return findAndCount(this.repo, {
      relations: ['user'],
      order: { created_at: 'DESC' },
      ...queries,
    });
  }

  findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  findByUser(userId: string, queries?: Obj) {
    return findAndCount(this.repo, {
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      ...queries,
    });
  }

  findByLabel(label: string, queries?: Obj) {
    label = decodeURIComponent(label).toLocaleLowerCase();

    return findAndCount(this.repo, {
      where: { labels: ArrayContains([label]) },
      order: { created_at: 'DESC' },
      relations: ['user'],
      ...queries,
    });
  }

  removeById(id: string) {
    return this.repo
      .softDelete({ id })
      .then((res) => ({ affected: res.affected }));
  }

  removeAll() {
    return this.repo.clear();
  }
}
