import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared/api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/shared.models';
import { map } from 'rxjs/operators';
import { PagedRequest, PagedResult } from '@shared/data/pagination.models';
import { FamiliesQuery, Family } from '@features/admin/people/families';


@Injectable()
export class FamiliesDataService extends HttpBaseService {
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

    pageRecords$( request: PagedRequest<Family>, query: FamiliesQuery ): Observable<PagedResult<Family>>
    {
        return this.browseRecords$(request, query)
            .pipe(
                map((pagedResult: PagedResult<Family>) => {
                    console.log('page', pagedResult);
                    return pagedResult;
                })
            );
    }

    browseRecords$(paging: PagedRequest<Family>, query: FamiliesQuery): Observable<PagedResult<Family>>
    {
        const body = {
            ...query,
            // Paging Parameters
            page: paging.page,
            results: paging.size,
            orderBy: paging.sort.property,
            sortOrder: paging.sort.order
        };

        return super.post<PagedResult<Family>>(`${this._apiUrl}/v1/families/browse`, body);
    }

    /**
     * Get family
     */
    getFamilyById$(familyId: number) {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/families/${familyId}`, null)
            .pipe(
                map(response => response.data)
            );
    }
}
