import { SortDirection } from 'mongodb';
// "express - validator"
// query("PageNumber").toInt().default(1)

export type basicSortQueryType = {
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
  searchNameTerm?: string;
};

export type OutputBasicSortQueryType = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export type GetBlogsSortDataType = OutputBasicSortQueryType & {searchNameTerm: string | null};

export type ExtendedSortQueryType = OutputBasicSortQueryType & {
  searchEmailTerm: string | null;
  searchLoginTerm: string | null
}

export const basicSortQuery = (
  query: basicSortQueryType,
): OutputBasicSortQueryType => {
  const result = {
    sortBy: query.sortBy ?? 'createdAt',
    sortDirection: query.sortDirection ?? 'desc',
    pageNumber: !isNaN(Number(query.pageNumber)) ? Number(query.pageNumber) : 1,
    pageSize: !isNaN(Number(query.pageSize)) ? Number(query.pageSize) : 10,
  };
  return result;
};
