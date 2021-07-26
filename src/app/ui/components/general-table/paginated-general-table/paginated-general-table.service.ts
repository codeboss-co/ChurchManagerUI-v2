import { Injectable } from '@angular/core';
import { PaginatedDataSource } from '@shared/data/paginated.data-source';
import { PaginatedEndpoint, Sort } from '@shared/data/pagination.models';

@Injectable()
export class PaginatedGeneralTableService<TModel, TQuery> {

    public dataSource: PaginatedDataSource<TModel, TQuery> | null;

    constructor(
        private endpoint: PaginatedEndpoint<TModel, TQuery>,
        initialSort: Sort<TModel>,
        initialQuery: TQuery)
    {
        this.dataSource = new PaginatedDataSource<TModel, TQuery>(
            endpoint, initialSort, initialQuery
        );
    }
}
