import { TableDefaults } from "@api";

export class PaginatedResult<T> {
    page: number = TableDefaults.page;
    size: number = TableDefaults.size;
    items: T[] = [];
    totalItems = 0;
    totalPages = 0;
}
