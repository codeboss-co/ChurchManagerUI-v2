import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared/api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/shared.models';
import { map } from 'rxjs/operators';
import { PagedRequest, PagedResult } from '@shared/data/pagination.models';
import { Mission, MissionsQuery } from '@features/admin/missions';

@Injectable()
export class MissionsDataService extends HttpBaseService {
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject( ENV ) private _environment: Environment )
    {
        super( http );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    pageRecords$( request: PagedRequest<Mission>, query: MissionsQuery ): Observable<PagedResult<Mission>>
    {
        return this.browseRecords$(request, query)
            .pipe(
                map((pagedResult: PagedResult<Mission>) => {
                    console.log('page', pagedResult);
                    return pagedResult;
                })
            );
    }

    browseRecords$(paging: PagedRequest<Mission>, query: MissionsQuery): Observable<PagedResult<Mission>>
    {
        const body = {
            ...query,
            // Paging Parameters
            page: paging.page,
            results: paging.size,
            orderBy: paging.sort.property,
            sortOrder: paging.sort.order
        };

        return super.post<PagedResult<Mission>>(`${this._apiUrl}/v1/missions/browse`, body);
    }

    /**
     * Get mission
     */
    getFamilyById$( missionId: number)
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/missions/${missionId}`, null)
            .pipe(
                map(response => response.data)
            );
    }

    /**
     * Add mission
     */
    createMission( model: any ): Observable<ApiResponse>
    {
        return super.post<ApiResponse>(`${this._apiUrl}/v1/missions`, model);
    }
}
