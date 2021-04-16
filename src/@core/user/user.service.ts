import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { first, map, shareReplay, tap } from 'rxjs/operators';
import { User } from '@core/user/user.model';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { UserDetails } from '@shared/shared.models';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
    user$ = this._user.asObservable();

    private _apiUrl = this._environment.baseUrls.apiUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, @Inject(ENV) private _environment: Environment)
    {
        this.fetchUserData();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) => {
                // Execute the observable
                this._user.next(response);
            })
        );
    }

    /**
     * Fetches, maps and stores the user details
     */
    fetchUserData(): void {
        this._httpClient.get<any>(`${this._apiUrl}/v1/userdetails/current-user`)
            .pipe(
                first(),
                shareReplay(1),
                tap(response => {
                    const userDetails = response.data as UserDetails;
                    console.log( 'userDetails', userDetails, '' );

                    const user = {
                        id: userDetails.userLoginId,
                        email: userDetails.email,
                        name: `${userDetails.firstName} ${userDetails.lastName}`,
                        avatar: userDetails.photoUrl || 'assets/images/avatars/profile-blank.jpg',
                        status: 'online'
                    };

                    this._user.next(user);
                })
            ).subscribe();
    }

}
