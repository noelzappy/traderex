import prisma from '@/database';
import { Prisma } from '@prisma/client';
import _ from 'lodash';

export type PaginationQuery<W = any, I = any> = {
  where?: W;
  include?: I;
  select?: any;
};

export interface PaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface PaginatedOptions {
  page: number;
  limit: number;
}

const paginate = async <T, W = any, I = any>(
  model: Prisma.ModelName,
  query: PaginationQuery<W, I>,
  options: PaginatedOptions,
): Promise<PaginateResult<T>> => {
  const { page = 1, limit = 10 } = options;
  const pageInt = parseInt(String(page), 10);
  const limitInt = parseInt(String(limit), 10);

  const offset = (pageInt - 1) * limitInt;

  const modelName: string = _.camelCase(model);

  const data = await prisma[modelName].findMany({
    ...query,
    skip: offset,
    take: limitInt,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const total = await prisma[modelName].count({
    where: query.where,
  });

  const totalPages = Math.ceil(total / limitInt);
  const hasPrevPage = pageInt > 1;
  const hasNextPage = pageInt < totalPages;

  return {
    docs: data,
    totalDocs: total,
    limit: limitInt,
    totalPages,
    page: pageInt,
    pagingCounter: offset + 1,
    hasPrevPage,
    hasNextPage,
    prevPage: hasPrevPage ? pageInt - 1 : null,
    nextPage: hasNextPage ? pageInt + 1 : null,
  };
};

export default paginate;
