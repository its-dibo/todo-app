import { FindManyOptions, Repository } from 'typeorm';

export interface Pagination {
  page?: number;
  limit?: number;
}
export interface QueryWithPagination extends Pagination, FindManyOptions<any> {
  [key: string]: any;
}

const maxPageCount = 50;

/**
 * add pagination functionality to the query object
 * check that the limit doesn't exceed the maximum page count
 *
 * @param query the query object including `{ page, limit }` or `{ take, skip }`
 * @returns the query object in addition to the pagination props
 */
// todo: extend `repo.findAndCount()` and return `{ data, count }`
export function findAndCount(
  repo: Repository<any>,
  query: QueryWithPagination,
) {
  let _query = { ...query };

  _query.take = +(_query.take || _query.limit || maxPageCount);
  _query.skip = +(_query.skip || ((_query?.page || 1) - 1) * maxPageCount);

  if (_query?.take && _query?.take > maxPageCount) _query.take = maxPageCount;

  return repo
    .findAndCount(_query)
    .then((res) => ({ data: res[0], count: res[1] }));
}
