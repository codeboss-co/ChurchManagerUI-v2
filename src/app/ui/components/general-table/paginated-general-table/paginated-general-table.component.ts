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

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component( {
    selector: 'paginated-general-table',
    styleUrls: ['paginated-general-table.component.css'],
    templateUrl: 'paginated-general-table.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations   : fuseAnimations
} )
export class PaginatedGeneralTableComponent implements OnChanges, AfterViewInit, AfterContentInit
{
    @Input() columns: TableColumn[] = [];
    @Input() buttons: TableBtn[] = [];
    @Input() filter: boolean = false;
    @Input() filterPlaceholder: string = 'Filter';
    @Input() footer: string = null;
    @Input() pagination: number[] = [];
    @Input() pageSize: number = 10;
    @Input() tableMinWidth: number = 500;
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


}


