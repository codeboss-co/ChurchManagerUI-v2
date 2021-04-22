import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared//api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs/internal/Observable';
import { map, shareReplay } from 'rxjs/operators';
import {
    CellGroupsWeeklyBreakdown,
    GroupAttendanceQuery,
    GroupAttendanceRecord,
    GroupAttendanceRecordDetail
} from '../cell-ministry.model';
import { PagedRequest, PagedResult } from '@shared/data/pagination.models';
import { ApiResponse } from '@shared/shared.models';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable()
export class CellMinistryDataService extends HttpBaseService
{
    // Private
    private _apiUrl = this._environment.baseUrls.apiUrl;

    private _attendanceRecord = new BehaviorSubject<GroupAttendanceRecordDetail>(null);
    private _weeklyChartData = new BehaviorSubject<CellGroupsWeeklyBreakdown[]>(null);

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment )
    {
        super(http);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for attendance record
     */
    get attendanceRecord$(): Observable<GroupAttendanceRecordDetail>
    {
        return this._attendanceRecord.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    pageCellAttendanceReports$( request: PagedRequest<GroupAttendanceRecord>, query: GroupAttendanceQuery ): Observable<PagedResult<GroupAttendanceRecord>>
    {
        return this.browseCellAttendanceReports$(request, query)
            .pipe(
                map((pagedResult: PagedResult<GroupAttendanceRecord>) => {
                    console.log('page', pagedResult);
                    return pagedResult;
                })
            );
    }

    browseCellAttendanceReports$(
        paging: PagedRequest<GroupAttendanceRecord>, query: GroupAttendanceQuery
    ): Observable<PagedResult<GroupAttendanceRecord>>
    {
        const body = {
            ...query,
            // Paging Parameters
            page: paging.page,
            results: paging.size,
            orderBy: paging.sort.property,
            sortOrder: paging.sort.order
        };

        return super.post<PagedResult<GroupAttendanceRecord>>(
            `${this._apiUrl}/v1/cellministry/attendance/browse`, body);
    }

    /**
     * Fetch chart data for cell ministry dashboard page
     */
    getChartData$(): Observable<CellGroupsWeeklyBreakdown[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/cellministry/charts`)
            .pipe(
                shareReplay(1),
                map(response => response.data),
                tap(chartData => this._weeklyChartData.next(chartData))
            );
    }

    /**
     * Fetch single attendance record
     */
    getAttendanceRecordById$( attendanceId: number ): Observable<GroupAttendanceRecordDetail> {
        return super.get<GroupAttendanceRecordDetail>(`${this._apiUrl}/v1/cellministry/attendance/${attendanceId}`)
            .pipe(
                tap(record => this._attendanceRecord.next(record))
            );
    }

    updateAttendanceFeedback$( attendanceId: number, feedback: string ): Observable<any> {
        const body = { attendanceId, feedback };
        return super.post<GroupAttendanceRecordDetail>(`${this._apiUrl}/v1/cellministry/attendance/feedback`, body);
    }
}
