import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared//api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs/internal/Observable';
import { AttendanceReportSubmissionSummary, CellGroupPerformance } from '../cell-ministry.model';
import { BehaviorSubject } from 'rxjs';
import { ApiResponse, PeriodTypes } from '@shared/shared.models';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class CellGroupPerformanceDataService extends HttpBaseService
{
    // Private
    private _apiUrl = this._environment.baseUrls.apiUrl;

    private _groupPerformanceRecord = new BehaviorSubject<CellGroupPerformance>(null);

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
     * Getter for group performance record
     */
    get groupPerformanceRecord$(): Observable<CellGroupPerformance>
    {
        return this._groupPerformanceRecord.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fetch group performance record
     */
    getGroupPerformanceRecord$( groupId: number, period: PeriodTypes): Observable<AttendanceReportSubmissionSummary>
    {
        const body = { groupId, period };
        return super.post<ApiResponse>(`${this._apiUrl}/v1/groups/${groupId}/performance-metrics`, body)
            .pipe(
                map(response => response.data),
                tap(records => this._groupPerformanceRecord.next(records))
            );
    }
}
