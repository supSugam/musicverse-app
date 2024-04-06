export type BaseResponse = {
  path: string;
  success: boolean;
  statusCode: number;
  message?: string;
};

export type SuccessResponse<T> = {
  result: T;
} & BaseResponse;

export type PaginationResponse<T> = {
  result: { items: T[]; totalCount: number };
} & BaseResponse;
