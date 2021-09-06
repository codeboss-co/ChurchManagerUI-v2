import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared/api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { PagedRequest, PagedResult } from '@shared/data/pagination.models';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { FollowUpQuery, FollowUpRecord } from '../follow-up.models';

@Injectable()
export class FollowUpDataService extends HttpBaseService
{
    // Private
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

    pageRecords$( request: PagedRequest<FollowUpRecord>, query: FollowUpQuery ): Observable<PagedResult<FollowUpRecord>>
    {
        return this.browseRecords$(request, query)
            .pipe(
                map((pagedResult: PagedResult<FollowUpRecord>) => {
                    console.log('page', pagedResult);
                    return pagedResult;
                })
            );
    }

    browseRecords$(paging: PagedRequest<FollowUpRecord>, query: FollowUpQuery): Observable<PagedResult<FollowUpRecord>>
    {
        const body = {
            ...query,
            // Paging Parameters
            page: paging.page,
            results: paging.size,
            orderBy: paging.sort.property,
            sortOrder: paging.sort.order
        };

        return super.post<PagedResult<FollowUpRecord>>(
            `${this._apiUrl}/v1/followup/browse`, body);
    }
}