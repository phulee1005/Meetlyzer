export type RTKResponse<T> = {
  success: boolean;
  message?: string;
  status?: number;
  response?: T;
};

export type RTKResponsePagination<T> = {
  success: boolean;
  message?: string;
  status?: number;
  response?: {
    data: T[];
    pagination: {
      limit: number;
      page: number;
      pageCount: number;
      total: number;
    };
  };
};

export interface Pagination {
  page: number;
  limit: number;
  orderBy: string;
  keyword?: string;
}

export const DEFAULT_PARAMS: Pagination = {
  page: 1,
  limit: 20,
  orderBy: "_id,desc",
  keyword: "",
};
