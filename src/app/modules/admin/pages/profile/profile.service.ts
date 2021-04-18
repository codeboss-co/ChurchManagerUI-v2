import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Profile, ProfileModel } from './profile.model';

@Injectable()
export class ProfileService
{
    private _profile: BehaviorSubject<Profile | null> = new BehaviorSubject(null);

    private _apiUrl = this.environment.baseUrls.apiUrl;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param environment
     */
    constructor(
        private _httpClient: HttpClient,
        @Inject(ENV) private environment: Environment
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for profile
     */
    get profile$(): Observable<Profile>
    {
        return this._profile.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get Person Profile
     * @summary: will return profile by person id if present in URL or the current logged in user
     */
    getUserProfile$(personId: number | undefined): Observable<Profile>
    {
        const profileUrl = personId === undefined
            ? `${this._apiUrl}/v1/profiles/current-user`  // Current User
            : `${this._apiUrl}/v1/profiles/person/${personId}`;  // Person Id

        return this._httpClient.get<any>(profileUrl)
            .pipe(
                tap(
                    response => {
                        const profile = new ProfileModel(response.data);
                        console.log( 'Profile', profile, 'getUserProfile$' );
                        this._profile.next(profile);
                    })
            );
    }

    /**
     * Testing: pagination requests
     */
    /*pageGroups( request: PagedRequest<IGroup>, query: GroupsQuery ): Observable<PagedResult<IGroup>> {
        console.log('page called', request, query);
        return this.browseGroupsApi(request.page, request.size, query.search, query.personId)
            .pipe(
                map((pagedResult: PagedResult<IGroup>) => {
                    return pagedResult;
                })
            );
    }*/


    /**
     * This is where you call your server,
     * you can pass your start page and end page
     */
    browseGroupsApi( page: number, size: number, search: string, personId?: number ): Observable<any> {
        const groupsUrl = personId === undefined
            ? `${this._apiUrl}/v1/groups/browse/current-user`  // Current User
            : `${this._apiUrl}/v1/groups/browse/person/${personId}`;  // Person Id

        return this._httpClient.post<any>( groupsUrl, {
            searchTerm: search,
            page,
            results: size
        } );
    }

}
