import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs';
import { ApiResponse, SelectItem } from '@shared/shared.models';
import { map, share } from 'rxjs/operators';
import { HttpBaseService } from '@shared/api/http-base.service';

@Injectable()
export class ChurchGroupsSelectControlDataService extends HttpBaseService
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment )
    {
        super(http);
    }

    /**
     * Get churches select information
     *
     * @returns {Observable<SelectItem[]>}
     */
    getChurches$(): Observable<SelectItem[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/churches`)
            .pipe(
                share(),
                map(response => response.data)
            );
    }

    /**
     * Get groups for church select information
     *
     * @returns {Observable<SelectItem[]>}
     */
    getGroups$(churchId: number): Observable<SelectItem[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/church/${churchId}`)
            .pipe(
                map(response => response.data)
            );
    }

}