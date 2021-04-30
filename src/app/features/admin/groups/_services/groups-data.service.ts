/**
 * @summary
 *
 * The real groups service as the other was a copy of contacts and needs refactoring
 */
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { GroupMemberSimple, GroupWithChildren } from '../group.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/shared.models';
import { map } from 'rxjs/operators';
import { HttpBaseService } from '@shared/api/http-base.service';
import { GroupAttendanceForm } from '../group-attendance.model';

@Injectable()
export class GroupsDataService extends HttpBaseService
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
     * Get group members and their simple information
     *
     * @returns {Observable<GroupMemberSimple[]>}
     */
    getGroupMembers$(groupId: number): Observable<GroupMemberSimple[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/${groupId}/members`, null)
            .pipe(
                map(response => response.data)
            );
    }

    registerAttendance$( model: GroupAttendanceForm ): Observable<any>
    {
        return super.post<any>(`${this._apiUrl}/v1/groups/${model.groupId}/attendance`, model);
    }
}