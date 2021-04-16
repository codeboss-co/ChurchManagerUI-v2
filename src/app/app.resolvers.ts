import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InitialData } from 'app/app.types';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { UserDetails } from '@shared/shared.models';

@Injectable({
    providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any>
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, @Inject(ENV) private _environment: Environment)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Use this resolver to resolve initial mock-api for the application
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InitialData>
    {
        // Fork join multiple API endpoint calls to wait all of them to finish
        return forkJoin([
            this._httpClient.get<any>('api/common/messages'),
            this._httpClient.get<any>('api/common/navigation'),
            this._httpClient.get<any>('api/common/notifications'),
            this._httpClient.get<any>('api/common/shortcuts'),
            this._httpClient.get<any>(`${this._apiUrl}/v1/userdetails/current-user`)
                .pipe(
                    map(response => {
                        const userDetails = response.data as UserDetails;
                        console.log( 'UserDetails', userDetails, 'InitialDataResolver' );

                        return  {
                            id: userDetails.userLoginId,
                            email: userDetails.email,
                            name: `${userDetails.firstName} ${userDetails.lastName}`,
                            avatar: userDetails.photoUrl || 'assets/images/avatars/profile-blank.jpg',
                            status: 'online'
                        };
                    }))
        ]).pipe(
            map(([messages, navigation, notifications, shortcuts, user]) => ({
                    messages,
                    navigation: {
                        compact   : navigation.compact,
                        default   : navigation.default,
                        futuristic: navigation.futuristic,
                        horizontal: navigation.horizontal
                    },
                    notifications,
                    shortcuts,
                    user
                })
            )
        );
    }
}
