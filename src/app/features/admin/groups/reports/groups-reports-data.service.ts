import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { GroupType } from '../group.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/shared.models';
import { map } from 'rxjs/operators';
import { HttpBaseService } from '@shared/api/http-base.service';
import { Moment } from 'moment';

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
    getAttendanceReportGrid$(groupTypeId: number, groupId: number, from: Moment, to: Moment) : Observable<GroupType>
    {
        const params = new HttpParams()
            .set('groupTypeId', groupTypeId)
            .set('groupId', groupId)
            .set('from', from.toDate().toUTCString())
            .set('to', to.toDate().toUTCString());

        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/attendance-report-grid`, params)
            .pipe(
                map(response => response.data)
            );
    }

}