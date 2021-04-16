import { Observable } from 'rxjs';

export interface Pagination {
    selectedSize: number;
    currentPage: number;
    pageSizes: number[];
}

/**
 * Defines a sorting to be applied (aka. send to the server) to the data.
 */
export interface Sort<T> {
    property: keyof T;
    order: 'asc' | 'desc';
}

/**
 * What we'll eventually pass to a service which in turn will kick off a corresponding HTTP request.
 */
export interface PagedRequest<T> {
    page: number;
    size: number;
    sort?: Sort<T>;
}

/**
 * Service will then respond with a PagedResult<T> containing the requested data.
 */
export interface PagedResult<T> {
    data: T[];
    totalPages: number;
    totalResults: number;

    currentPage?: number;
    resultsPerPage?: number;
}

/**
 * Strongly typed function that maps a page request to an paged stream of results
 */
export type PaginatedEndpoint<T, Q> = (pageable: PagedRequest<T>, query: Q) => Observable<PagedResult<T>>;
