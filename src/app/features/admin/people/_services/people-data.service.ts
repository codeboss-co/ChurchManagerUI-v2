import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { BehaviorSubject, merge, Observable, of, throwError } from 'rxjs';
import { GroupMemberSimple } from '@features/admin/groups';
import { ApiResponse } from '@shared/shared.models';
import { NewFamilyForm } from '../new-family-form/person-form/person-form.model';
import { HttpBaseService } from '@shared/api/http-base.service';
import { PagedRequest, PagedResult } from '@shared/data/pagination.models';
import { People, PeopleSearchQuery, Person } from '@features/admin/people';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { tap } from 'rxjs/internal/operators/tap';
import { ProfileModel } from '../../../../pages/profile/profile.model';

@Injectable()
export class PeopleDataService extends HttpBaseService
{
    // Private
    private _person: BehaviorSubject<Person> = new BehaviorSubject(null);
    private _people: BehaviorSubject<People> = new BehaviorSubject([]);

    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment )
    {
        super(http);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for person
     */
    get person$(): Observable<Person>
    {
        return this._person.asObservable();
    }

    /**
     * Getter for people
     */
    get people$(): Observable<People>
    {
        return this._people.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Get selected person from the current list of people
     *
     */
    getPersonById$(personId: number): Observable<ApiResponse> {

        const profileUrl = `${this._apiUrl}/v1/profiles/person/${personId}?condensed=true`;

        return this.http.get<ApiResponse>(profileUrl)
            .pipe(
                // Store the selected person
                tap(response =>  this._person.next(response.data as Person))
            );
    }

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
                    this._people.next(pagedResult.data);
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
