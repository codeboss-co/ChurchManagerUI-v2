import { Component, OnInit } from '@angular/core';
import { GroupsReportsDataService } from '@features/admin/groups/reports/groups-reports-data.service';
import {
    GroupAttendanceReportGridQuery,
    GroupAttendanceReportGridRow
} from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'cell-ministry-attendance-analytics',
    templateUrl: './attendance-analytics.component.html'
} )
export class AttendanceAnalyticsComponent implements OnInit
{
    // Private
    private _query = new Subject<GroupAttendanceReportGridQuery>()
    private _reports = new Subject<GroupAttendanceReportGridRow[]>()
    private _unsubscribeAll = new Subject();

    reports$ = this._reports.asObservable();

    constructor( private _data: GroupsReportsDataService )
    {
    }

    ngOnInit(): void
    {
        // Fetch data based on query
        const data$ = this._query
            .pipe(
                switchMap( ( query: GroupAttendanceReportGridQuery ) => {
                    const { groupTypeId, groupId, from, to } = query;
                    return this._data.getAttendanceReportGrid$( groupTypeId, groupId, from, to );
                } )
            );

        data$
            .pipe( takeUntil( this._unsubscribeAll ) )
            .subscribe(
                ( results: GroupAttendanceReportGridRow[] ) => this._reports.next(results)
            );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onSearchUpdated( query: GroupAttendanceReportGridQuery )
    {
        this._query.next(query);
    }
}
