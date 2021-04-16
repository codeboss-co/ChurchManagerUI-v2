import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { User } from '@core/user/user.model';
import { AuthService } from '../auth/auth.service';

export interface UserDetails {
    username?: string;
    userLoginId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    photoUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        //this.fetchUserData();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
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
    fetchUserData$(): Observable<User> {
        return this._httpClient.get<any>(`http://localhost:5001/api/v1/userdetails/current-user`)
            .pipe(
                first(),
                shareReplay(1),
                map(response => {
                    const userDetails = response.data as UserDetails;
                    console.log( 'userDetails', userDetails, '' );

                    return {
                        id: userDetails.userLoginId,
                        email: userDetails.email,
                        name: `${userDetails.firstName} ${userDetails.lastName}`,
                        avatar: userDetails.photoUrl || ''
                    };
                })
            );

        /*this._httpClient.get<any>(`http://localhost:5001/api/v1/userdetails/userLogin/${userLoginId}`)
            .pipe(
                first(),
                shareReplay(1)
            ).subscribe(response => {
                const userDetails = response.data as UserDetails;
                console.log( 'userDetails', userDetails, '' );

                this.user = {
                    id: userLoginId,
                    email: userDetails.email,
                    name: `${userDetails.firstName} ${userDetails.lastName}`,
                    avatar: userDetails.photoUrl || ''
                };
            });*/
    }

}
