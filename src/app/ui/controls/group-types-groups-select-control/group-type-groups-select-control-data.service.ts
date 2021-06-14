import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs';
import { ApiResponse, SelectItem } from '@shared/shared.models';
import { map, share } from 'rxjs/operators';
import { HttpBaseService } from '@shared/api/http-base.service';

@Injectable()
export class GroupTypeGroupsSelectControlDataService extends HttpBaseService
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment )
    {
        super(http);
    }

    /**
     * Get group types select information
     *
     * @returns {Observable<SelectItem[]>}
     */
    getGroupTypes$(): Observable<SelectItem[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/types`)
            .pipe(
                share(),
                map(response => response.data)
            );
    }

    /**
     * Get groups for group type select information
     *
     * @returns {Observable<SelectItem[]>}
     */
    getGroups$(groupTypeId: number): Observable<SelectItem[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/type/${groupTypeId}/select`)
            .pipe(
                map(response => response.data)
            );
    }

}