import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseAnimations } from '@fuse/animations';
import { merge, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, map, takeUntil } from 'rxjs/operators';
import { CellMinistryDataService } from '../cell-ministry-data.service';
import { GroupAttendanceQuery, GroupAttendanceRecord } from '../cell-ministry.model';
import { PaginatedDataSource } from '@shared/data/paginated.data-source';
import { Sort } from '@shared/data/pagination.models';
import { tap } from 'rxjs/internal/operators/tap';
import { Observable } from 'rxjs/internal/Observable';
import { ChurchGroup } from '@ui/controls/church-groups-select-control/church-group.model';

@Component({
    selector     : 'cell-ministry-attendance-reports',
    templateUrl  : './cell-attendance-reports.component.html',
    styleUrls    : ['./cell-attendance-reports.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class CellAttendanceReportsComponent implements OnInit
{
    searchForm: FormGroup;
    searchBtnClicked = new Subject();

    displayedColumns: string[] = ['attendanceDate', 'groupName', 'didNotOccur', 'attendanceCount',
        'firstTimerCount', 'newConvertCount', 'receivedHolySpiritCount', 'hasNotes', 'hasPhotos'
    ];
    dataSource: PaginatedDataSource<GroupAttendanceRecord, GroupAttendanceQuery> | null;

    // Private
    private _unsubscribeAll = new Subject();

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {CellMinistryDataService} _data
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _data: CellMinistryDataService
    )
    {
        this.searchForm = this._formBuilder.group({
            churchGroup: [null, [Validators.required]],
            withFeedBack: [false],
            from: [null],
            to: [null]
        });
    }

    ngOnInit(): void {

        const query$: Observable<GroupAttendanceQuery> =  this.searchBtnClicked
            .pipe(
                filter( () =>  this.searchForm.valid),
                takeUntil(this._unsubscribeAll),
                map( () => {

                    const churchGroup = this.searchForm.get('churchGroup').value as ChurchGroup;
                    const withFeedBack = this.searchForm.get('withFeedBack').value;
                    const from = this.searchForm.get('from').value;
                    const to = this.searchForm.get('to').value;

                    const {churchId, groupId} = churchGroup;

                    return {churchId, groupId, withFeedBack, from, to};
                })
            );

        const initDatasource$ = query$
            .pipe(
                filter(() => !this.dataSource),
                tap(initialQuery => {
                        const initialSort: Sort<GroupAttendanceRecord> = {property: 'attendanceDate', order: 'desc'};

                        this.dataSource =  new PaginatedDataSource<GroupAttendanceRecord, GroupAttendanceQuery>(
                            (request, query) => this._data.pageCellAttendanceReports$(request, query),
                            initialSort,
                            initialQuery,
                        );
                    }
                )
            );

        const afterInitDatasource$ = query$
            .pipe(
                filter(() => !!this.dataSource),
                tap(query =>  this.dataSource.queryBy(query))
            );

        merge(initDatasource$, afterInitDatasource$).subscribe();

        /*this.searchBtnClicked
            .pipe(
                filter( () =>  this.searchForm.valid),
                takeUntil(this._unsubscribeAll),
                tap( () => {

                    const churchGroup = this.searchForm.get('churchGroup').value as ChurchGroup;
                    const withFeedBack = this.searchForm.get('withFeedBack').value;
                    const from = this.searchForm.get('from').value;
                    const to = this.searchForm.get('to').value;

                    const {churchId, groupId} = churchGroup;

                    // Initialize Paginated Data Source
                    if ( !this.dataSource ) {
                        const initialSort: Sort<GroupAttendanceRecord> = {property: 'attendanceDate', order: 'desc'};
                        const initialQuery: GroupAttendanceQuery = {churchId, groupId, withFeedBack, from, to};

                        this.dataSource =  new PaginatedDataSource<GroupAttendanceRecord, GroupAttendanceQuery>(
                            (request, query) => this._data.pageCellAttendanceReports$(request, query),
                            initialSort,
                            initialQuery,
                        );
                    } else {
                        this.dataSource.queryBy({churchId, groupId, withFeedBack, from, to});
                    }
                })
            )
            .subscribe();*/
    }
}