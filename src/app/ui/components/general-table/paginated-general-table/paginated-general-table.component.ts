import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PAGING_SERVICE, TableBtn, TableColumn, TableQuery } from '..';
import { PagedResult } from '@shared/data/pagination.models';
import { takeUntil, tap } from 'rxjs/operators';
import { IPaginatedTableService } from '@ui/components/general-table/paginated-general-table/paginated-general-table.service';
import { fuseAnimations } from '@fuse/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component( {
    selector: 'paginated-general-table',
    styleUrls: ['paginated-general-table.component.css'],
    templateUrl: 'paginated-general-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations   : fuseAnimations
} )
export class PaginatedGeneralTableComponent implements OnChanges, AfterViewInit, AfterContentInit
{
    @Input() debug: boolean = false;

    @Input() columns: TableColumn[] = [];
    @Input() buttons: TableBtn[] = [];
    @Input() selectable: boolean = false;
    @Input() filter: boolean = false;
    @Input() filterPlaceholder: string = 'Filter results';
    @Input() footer: string = null;
    @Input() pagination: number[] = [];
    @Input() pageSize: number = 10;
    @Output() filteredData = new EventEmitter<any[]>();
    @Output() buttonClick = new EventEmitter<string[]>();

    // ContentChildren includes only elements that exists within the ng-content
    @ContentChild('query', { static: true }) tableQuery: TableQuery;

    // ViewChildren don’t include elements that exist within the ng-content tag.
    @ViewChild( MatPaginator, { static: true } ) paginator: MatPaginator;
    @ViewChild( MatSort, { static: true } ) sort: MatSort;

    displayedColumns: string[];

    page: PagedResult<any> = {totalResults: 0, totalPages: 0, data: []};
    selection = new SelectionModel<string>(true, []);
    resultsOnThisPage = [];


    // Private
    private _unsubscribeAll = new Subject();

    constructor(@Inject(PAGING_SERVICE) public service: IPaginatedTableService)
    {
        if ( !service )
        {
            throw new Error('PAGING_SERVICE has not been defined. Configure provider with injection token: PAGING_SERVICE');
        }

        this.service.page$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(page => this.page = page);
    }

    ngOnChanges( changes: SimpleChanges ): void
    {
        if(changes.columns)
        {
            this.displayedColumns = [...this.columns.map(c => c.columnDef)];
            if (this.buttons && this.buttons.length > 0 ) this.displayedColumns = [...this.displayedColumns, 'actions'];
            if (this.selectable) this.displayedColumns = ['select', ...this.displayedColumns];
        }
    }

    applyFilter( filterValue: string )
    {
    }

    ngAfterViewInit(): void
    {
        console.log('Paginator', this.paginator);
    }

    ngAfterContentInit(): void
    {
        const afterInitDatasource$ = this.tableQuery.query$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                tap((query) =>  {
                    this.paginator.firstPage();
                    this.service.queryBy(query);
                })
            );

        afterInitDatasource$.subscribe();
    }



    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {

        const numSelected = this.resultsOnThisPage.length;

        // this is the list of items retrieved from the server for any single pagination event
        const numRows = this.page.resultsPerPage;
        //console.log(numSelected,numRows);

        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            (
                    this.resultsOnThisPage.length = 0,
                    this.page.data.forEach(
                        (row) => {
                            this.selection.deselect(row['id']);
                        }
                    )
            ):
            this.page.data.forEach(
                (row) => {
                    this.selection.select(row['id']);
                    this.resultsOnThisPage.push(row['id']);
                }
            );
    }


    select( id: string)
    {
        this.resultsOnThisPage.push(id);
    }

    logSelection()
    {
        console.log('selected', this.selection.selected);
    }

    fetch(pageIndex: number) {
        this.service.fetch(pageIndex);
        this.resultsOnThisPage.length = 0;
    }
}


