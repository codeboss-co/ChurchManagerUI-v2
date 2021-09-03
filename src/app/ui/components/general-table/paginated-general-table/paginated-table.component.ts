import {
    AfterContentInit,
    AfterViewInit,
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
import { Sort } from '@shared/data/pagination.models';
import { tap } from 'rxjs/operators';
import { IPaginatedTableService } from '@ui/components/general-table/paginated-general-table/paginated-general-table.service';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component( {
    selector: 'paginated-general-table',
    styleUrls: ['paginated-general-table.component.css'],
    templateUrl: 'paginated-general-table.component.html',
} )
export class PaginatedTableComponent implements OnChanges, AfterViewInit, AfterContentInit
{
    @Input() columns: TableColumn[] = [];
    @Input() buttons: TableBtn[] = [];
    @Input() filter: boolean = false;
    @Input() filterPlaceholder: string = 'Filter';
    @Input() footer: string = null;
    @Input() pagination: number[] = [];
    @Input() pageSize: number;
    @Input() tableMinWidth: number = 500;
    @Output() filteredData = new EventEmitter<any[]>();
    @Output() buttonClick = new EventEmitter<string[]>();

    //@Input() query: any;
    @Input() initialSort: Sort<any>;

    displayedColumns: string[];

    // ContentChildren includes only elements that exists within the ng-content
    @ContentChild('query', { static: true }) contentChild: TableQuery;

    // ViewChildren don’t include elements that exist within the ng-content tag.
    @ViewChild( MatPaginator, { static: true } ) paginator: MatPaginator;
    @ViewChild( MatSort, { static: true } ) sort: MatSort;

    constructor(@Inject(PAGING_SERVICE) public service: IPaginatedTableService)
    {
    }

    ngOnChanges( changes: SimpleChanges ): void
    {
        this.displayedColumns = [...this.columns.map(c => c.columnDef)];
    }

    applyFilter( filterValue: string )
    {
    }

    ngAfterViewInit(): void {
    }

    ngAfterContentInit(): void {
        console.log('ContentChild', this.contentChild);
        this.contentChild.query$.subscribe(
            value => console.log('query result', value)
        );

        const afterInitDatasource$ = this.contentChild.query$
            .pipe(
                tap(query =>  this.service.queryBy(query))
            );

        afterInitDatasource$.subscribe();
    }


}


