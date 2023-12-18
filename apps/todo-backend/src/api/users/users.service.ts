import { Injectable } from '@nestjs/common';
import { PartialUserEntity, UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { Pagination, findAndCount } from '#shared/database';
import { Obj } from '#types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  getRepo() {
    return this.repo;
  }

  create(data: UserEntity) {
    return bcrypt
      .hash(data.password, 10)
      .then((password) =>
        this.repo
          .insert({ ...data, password })
          .then((res) => (Array.isArray(data) ? res?.raw : res?.raw[0])),
      );
  }

  // todo: add {limit, skip, conditions}
  findAll(queries?: Obj) {
    // the password field already removed by the schema
    return findAndCount(this.repo, {
      order: { created_at: 'DESC' },
      ...queries,
    });
  }

  findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  findBy(key: string, value: string, queries?: Obj) {
    return findAndCount(this.repo, {
      order: { created_at: 'DESC' },
      where: { [key]: Like(`%${value}%`), ...queries },
    });
  }

  findOneBy(key: string, value: string) {
    return this.repo.findOneBy({ [key]: value });
  }

  /**
   * get a password by user's email
   * the password field must be selected explicitly
   * @param email
   * @returns
   */
  getPassword(email: string) {
    return this.repo.findOne({
      // todo: `select *, password`
      select: ['password', 'id', 'firstName', 'lastName', 'role'],
      where: { email },
    });
  }

  // todo: limit 1
  updateById(id: string, data: PartialUserEntity) {
    return this.repo
      .update({ id }, data)
      .then((res) => ({ affected: res.affected }));
  }

  // todo: add forceRemove()
  // todo: add option to skip soft delete
  removeById(id: string) {
    return this.repo
      .softDelete({ id })
      .then((res) => ({ affected: res.affected }));
  }

  removeAll() {
    // todo: replace with .softDelete({})
    return this.repo.clear();
  }
}
