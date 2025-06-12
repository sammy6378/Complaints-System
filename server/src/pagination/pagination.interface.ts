export interface Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    last: string;
    previous: string;
    current: string;
    next: string;
  };
}
