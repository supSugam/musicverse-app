export type BaseResponse = {
  path: string;
  success: boolean;
  statusCode: number;
  message?: string;
};

export type SuccessResponse<T extends Object> = {
  result: T;
} & BaseResponse;
