import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GroupsReportsDataService } from '@features/admin/groups/reporting/groups-reports-data.service';
import { GroupAttendanceReportGridQuery } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { Subject } from 'rxjs';
import { finalize, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ReportTemplatesDataService } from '@features/common/reports/_services/report-templates-data.service';

@Component( {
    selector: 'group-attendance-analytics',
    templateUrl: './group-attendance-analytics.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class GroupAttendanceAnalyticsComponent implements OnInit
{
    //  Grid report
    report$ = new Subject<Flexmonster.Report>();
    isLoading = false;

    // Private
    private _query = new Subject<GroupAttendanceReportGridQuery>()
    private _unsubscribeAll = new Subject();

    constructor(
        private _data: GroupsReportsDataService,
        private _reportTemplates: ReportTemplatesDataService)
    {
    }

    ngOnInit(): void
    {
        // Fetch data based on query
        const data$ = this._query
            .pipe(tap(_ => this.isLoading = true))
            .pipe(
                switchMap( ( query: GroupAttendanceReportGridQuery ) => {
                    const { groupTypeId, groupId, from, to } = query;
                    return this._data.getAttendanceReportGrid$( groupTypeId, groupId, from, to )
                        .pipe(finalize(() => this.isLoading = false));
                } )                
            );

        // load data with the report template
        data$
            .pipe(withLatestFrom(this._reportTemplates.template$))
            .pipe(takeUntil( this._unsubscribeAll))
            .subscribe(
                ( [data, report ]) => {
                    // set the data on the report
                    report.dataSource.data = data;
                    // notify the report change
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
