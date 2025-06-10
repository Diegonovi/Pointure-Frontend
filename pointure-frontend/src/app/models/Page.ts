export interface Page<T> {
  data: T[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}