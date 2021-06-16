import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/shared.models';
import { map } from 'rxjs/operators';
import { HttpBaseService } from '@shared/api/http-base.service';
import { Moment } from 'moment';
import { GroupAttendanceReportGridRow } from '@features/admin/groups/cell-ministry/cell-ministry.model';

@Injectable()
export class GroupsReportsDataService extends HttpBaseService
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment )
    {
        super(http);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get group attendance grid records
     */
    getAttendanceReportGrid$(groupTypeId: number, groupId: number[], from: Moment, to: Moment) : Observable<GroupAttendanceReportGridRow[]>
    {
        const body = {
            groupTypeId,
            groupId,
            from: from.toDate(),
            to: to.toDate()
        };

        return super.post<ApiResponse>(`${this._apiUrl}/v1/groups/attendance-report-grid`, body)
            .pipe(
                map(response => response.data.map(x => new GroupAttendanceReportGridRow(x)))
            );
    }

}