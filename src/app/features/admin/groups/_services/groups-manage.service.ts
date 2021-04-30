import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared/api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupWithChildren } from '@features/admin/groups';
import { ApiResponse } from '@shared/shared.models';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class GroupsManageService extends HttpBaseService
{
    private _groups: BehaviorSubject<GroupWithChildren[]> = new BehaviorSubject([]);

    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject( ENV ) private _environment: Environment ) {
        super( http );
    }

    /**
     * Get groups with their children in the form of a tree
     */
    getGroupsTree$(): Observable<GroupWithChildren[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/tree`, null)
            .pipe(
                map(response => response.data),
                tap(groups => this._groups.next(groups))
            );
    }
}