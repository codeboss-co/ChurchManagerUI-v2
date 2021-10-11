// TODO: move to own file
import { BehaviorSubject, combineLatest, defer, Observable, Subject } from 'rxjs';
import { finalize, map, share, startWith, switchMap } from 'rxjs/operators';
import { PagedResult, PaginatedEndpoint, Sort } from './pagination.models';
import { SimpleDataSource } from './simple.data-source';

export class PaginatedDataSource<TModel, TQuery> implements SimpleDataSource<TModel>, IPaginatedDataSource
{
    private _pageNumber = new Subject<number>();
    private _sort: BehaviorSubject<Sort<TModel>>;
    private _query: BehaviorSubject<TQuery>;

    private _loading = new Subject<boolean>();

    public loading$ = this._loading.asObservable();
    page$: Observable<PagedResult<TModel>>;

    constructor(
        public endpoint: PaginatedEndpoint<TModel, TQuery>,
        initialSort: Sort<TModel>,
        initialQuery: TQuery,
        public pageSize = 10) {

        this._query = new BehaviorSubject<TQuery>(initialQuery);
        this._sort = new BehaviorSubject<Sort<TModel>>(initialSort);

        const param$ = combineLatest([this._query, this._sort]);

        this.page$ = param$
            .pipe(
                switchMap(([query, sort]) => this._pageNumber
                    .pipe(
                        startWith(0),
                        switchMap((page: number) => this.endpoint({page, sort, size: this.pageSize}, query)
                            .pipe(indicate(this._loading))
                        )
                    )),
                share()
            );
    }

    sortBy( sort: Partial<Sort<TModel>> ): void {
        const lastSort = this._sort.getValue();
        const nextSort = { ...lastSort, ...sort };
        this._sort.next( nextSort );
    }

    queryBy( query: Partial<TQuery> ): void {
        const lastQuery = this._query.getValue();
        const nextQuery = { ...lastQuery, ...query };
        this._pageNumber.next(0);
        this._query.next( nextQuery );
    }

    fetch( page: number ): void {
        this._pageNumber.next( page + 1 ); // MatPaginator starts at page 0
    }

    /**
     * Basically returns the current list of paginated/filtered/sorted items
     * @returns Observable that emits a new value when the data changes.
     * */
    connect(): Observable<TModel[]> {
        //  provide a stream of lists of items by mapping from the page
        return this.page$.pipe( map( page => page.data ) );
    }

    disconnect(): void {  }
}

// https://nils-mehlhorn.de/posts/indicating-loading-the-right-way-in-angular
export function prepare<T>(callback: () => void): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => defer(() => {
        callback();
        return source;
    });
}

export function indicate<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T> {
    return (source: Observable<T>): Observable<T> => source.pipe(
        prepare(() => indicator.next(true)),
        finalize(() => indicator.next(false))
    );
}

export interface IPaginatedDataSource
{
    page$: Observable<PagedResult<any>>;

    loading$: Observable<boolean>;
    //endpoint: PaginatedEndpoint<any, any>;
    //pageSize: number;

    //sortBy( sort: Partial<Sort<any>> ): void;

    queryBy(query: Partial<any>): void;

    fetch(page: number): void;
}
