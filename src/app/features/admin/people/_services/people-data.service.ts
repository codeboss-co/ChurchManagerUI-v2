import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs';
import { GroupMemberSimple } from '../../groups/group.model';
import { ApiResponse } from '@shared/shared.models';
import { NewFamilyForm } from '../new-family-form/person-form/person-form.model';
import { HttpBaseService } from '@shared/api/http-base.service';
import { PagedRequest, PagedResult } from '@shared/data/pagination.models';
import { GroupAttendanceQuery, GroupAttendanceRecord } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { PeopleSearchQuery, Person } from '@features/admin/people';
import { map } from 'rxjs/operators';

@Injectable()
export class PeopleDataService extends HttpBaseService
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
    addNewFamily$(model: NewFamilyForm): Observable<ApiResponse>
    {
        return super.post<ApiResponse>(`${this._apiUrl}/v1/people/family/new`, model);
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Paging methods
    // -----------------------------------------------------------------------------------------------------

    pagePeople$(request: PagedRequest<Person>, query: PeopleSearchQuery): Observable<PagedResult<Person>>
    {
        return this._browsePeople$(request, query)
            .pipe(
                map((pagedResult: PagedResult<Person>) => {
                    console.log('page', pagedResult);
                    return pagedResult;
                })
            );
    }

    /**
     * Browse people
     */
    private _browsePeople$(paging: PagedRequest<Person>, query: PeopleSearchQuery): Observable<PagedResult<Person>>
    {
        const body = {
            ...query,
            // Paging Parameters
            page: paging.page,
            results: paging.size,
            orderBy: paging.sort.property,
            sortOrder: paging.sort.order
        };

        return super.post<PagedResult<Person>>(`${this._apiUrl}/v1/people/browse`, body);
    }
}
