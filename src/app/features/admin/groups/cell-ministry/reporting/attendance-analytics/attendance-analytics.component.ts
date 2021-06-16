import { Component, OnInit } from '@angular/core';
import { GroupsReportsDataService } from '@features/common/reports/_services/groups-reports-data.service';
import {
    GroupAttendanceReportGridQuery,
    GroupAttendanceReportGridRow
} from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { ReportTemplatesDataService } from '@features/common/reports/_services/report-templates-data.service';

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
    report$ = new Subject<Flexmonster.Report>();

    constructor(
        private _data: GroupsReportsDataService,
        private _reportTemplates: ReportTemplatesDataService)
    {
        this._reportTemplates.getReport$('group-attendance-report')
            .subscribe(value => console.log('getReport$', value));
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

        const reportTemplate$ = this._reportTemplates.getReport$('group-attendance-report');

        data$
            .pipe(takeUntil( this._unsubscribeAll ))
            .pipe(withLatestFrom(reportTemplate$))
            .subscribe(
                ( [results, report ]) => {

                    console.log('loaded template', report)

                    report.dataSource.data = results;

                    this.report$.next(report)
                }
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
