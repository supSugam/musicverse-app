import { SortOrder } from '../enums/SortOrder';

export interface IBasePaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortOrder?: SortOrder;
}
