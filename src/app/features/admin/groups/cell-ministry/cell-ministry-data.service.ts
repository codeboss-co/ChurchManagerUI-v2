import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared//api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs/internal/Observable';
import { map, share } from 'rxjs/operators';
import { CellGroupsWeeklyBreakdown, GroupAttendanceQuery, GroupAttendanceRecord } from './cell-ministry.model';
import { PagedRequest, PagedResult } from '@shared/data/pagination.models';
import { ApiResponse } from '@shared/shared.models';

@Injectable()
export class CellMinistryDataService extends HttpBaseService
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment )
    {
        super(http);
    }

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

    getChartData$(): Observable<CellGroupsWeeklyBreakdown[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/cellministry/charts`)
            .pipe(
                share(),
                map(response => response.data)
            );
    }
}