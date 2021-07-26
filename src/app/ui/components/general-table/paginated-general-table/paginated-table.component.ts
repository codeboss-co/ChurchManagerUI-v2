import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PAGING_SERVICE, TableBtn, TableColumn } from '..';
import { Sort } from '@shared/data/pagination.models';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component( {
    selector: 'paginated-general-table',
    styleUrls: ['paginated-general-table.component.css'],
    templateUrl: 'paginated-general-table.component.html',
} )
export class PaginatedTableComponent implements OnChanges
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

    @Input() query: any;
    @Input() initialSort: Sort<any>;

    displayedColumns: string[];

    @ViewChild( MatPaginator, { static: true } ) paginator: MatPaginator;
    @ViewChild( MatSort, { static: true } ) sort: MatSort;

    constructor( @Inject( PAGING_SERVICE ) public service )
    {
    }

    ngOnChanges( changes: SimpleChanges ): void
    {
        this.displayedColumns = [...this.columns.map(c => c.columnDef)];
    }

    applyFilter( filterValue: string )
    {

    }
}


