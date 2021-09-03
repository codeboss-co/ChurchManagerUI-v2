import { Injectable } from '@angular/core';
import { IPaginatedDataSource, PaginatedDataSource } from '@shared/data/paginated.data-source';
import { PagedResult, PaginatedEndpoint, Sort } from '@shared/data/pagination.models';
import { Observable } from 'rxjs';

export interface IPaginatedTableService extends IPaginatedDataSource
{
    readonly dataSource: IPaginatedDataSource;
}

@Injectable()
export class PaginatedGeneralTableService<TModel, TQuery> implements IPaginatedTableService {

    public readonly dataSource: PaginatedDataSource<TModel, TQuery> | null;

    page$: Observable<PagedResult<TModel>>;

    constructor(
        private endpoint: PaginatedEndpoint<TModel, TQuery>,
        initialSort: Sort<TModel>,
        initialQuery: TQuery)
    {
        this.dataSource = new PaginatedDataSource<TModel, TQuery>(
            endpoint, initialSort, initialQuery
        );

        this.page$ = this.dataSource.page$;
    }

    queryBy(query: Partial<TQuery>): void
    {
        this.dataSource.queryBy(query);
    }

    fetch(page: number): void
    {
        this.dataSource.fetch(page);
    }
}
