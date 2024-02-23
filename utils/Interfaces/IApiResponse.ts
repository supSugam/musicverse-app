export type SuccessResponse<T extends Object> = {
  path: string;
  success: boolean;
  statusCode: number;
  result: T;
};
