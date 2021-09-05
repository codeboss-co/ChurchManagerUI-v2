import {
    AfterContentInit,
    AfterViewInit, ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild, ViewEncapsulation
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PAGING_SERVICE, TableBtn, TableColumn, TableQuery } from '..';
import { PagedResult, Sort } from '@shared/data/pagination.models';
import { tap } from 'rxjs/operators';
import { IPaginatedTableService } from '@ui/components/general-table/paginated-general-table/paginated-general-table.service';
import { fuseAnimations } from '@fuse/animations';
import { SelectionModel } from '@angular/cdk/collections';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component( {
    selector: 'paginated-general-table',
    //styleUrls: ['paginated-general-table.component.css'],
    templateUrl: 'paginated-general-table.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations   : fuseAnimations
} )
export class PaginatedGeneralTableComponent implements OnChanges, AfterViewInit, AfterContentInit
{
    @Input() debug: boolean = true;

    @Input() columns: TableColumn[] = [];
    @Input() buttons: TableBtn[] = [];
    @Input() selectable: boolean = true;
    @Input() filter: boolean = false;
    @Input() filterPlaceholder: string = 'Filter';
    @Input() footer: string = null;
    @Input() pagination: number[] = [];
    @Input() pageSize: number = 10;
    @Output() filteredData = new EventEmitter<any[]>();
    @Output() buttonClick = new EventEmitter<string[]>();

    //@Input() query: any;
    @Input() initialSort: Sort<any>;

    displayedColumns: string[];

    page: PagedResult<any> = {totalResults: 0, totalPages: 0, data: []};

    // ContentChildren includes only elements that exists within the ng-content
    @ContentChild('query', { static: true }) contentChild: TableQuery;

    // ViewChildren don’t include elements that exist within the ng-content tag.
    @ViewChild( MatPaginator, { static: true } ) paginator: MatPaginator;
    @ViewChild( MatSort, { static: true } ) sort: MatSort;

    constructor(@Inject(PAGING_SERVICE) public service: IPaginatedTableService)
    {
        this.service.page$.subscribe(page => this.page = page);
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
        console.log('ContentChild', this.contentChild);
        this.contentChild.query$.subscribe(
            value => console.log('query result', value)
        );

        const afterInitDatasource$ = this.contentChild.query$
            .pipe(
                tap((query) =>  {
                    this.paginator.firstPage();
                    this.service.queryBy(query);
                })
            );

        afterInitDatasource$.subscribe();
    }


    selection = new SelectionModel<string>(true, []);
    docsOnThisPage = [];
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {

        const numSelected = this.docsOnThisPage.length;

        // this is the list of items retrieved from the server for any single pagination event
        const numRows = this.page.resultsPerPage;
        //console.log(numSelected,numRows);

        console.log('isAllSelected', numSelected === numRows, numSelected, numRows);
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            (
                    this.docsOnThisPage.length = 0,
                    this.page.data.forEach(
                        (row) => {
                            this.selection.deselect(row['id']);
                        }
                    )
            ):
            this.page.data.forEach(
                (row) => {
                    this.selection.select(row['id']);
                    this.docsOnThisPage.push(row['id']);
                }
            );
    }


    isSomeSelected(id: string)
    {
        this.docsOnThisPage.push(id);
    }

    logSelection()
    {
        console.log('selected', this.selection.selected);
    }

    fetch(pageIndex: number) {
        this.service.fetch(pageIndex);
        this.docsOnThisPage.length = 0;
    }
}


