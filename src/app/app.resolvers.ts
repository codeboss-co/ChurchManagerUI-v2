import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InitialData } from 'app/app.types';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { UserDetails } from '@shared/shared.models';
import LogRocket from 'logrocket';
import { AuthService } from '@core/auth/auth.service';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Injectable({
    providedIn: 'root'
})
export class InitialDataResolver implements Resolve<any> {
    private _apiUrl = this._environment.baseUrls.apiUrl;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _auth: AuthService,
        @Inject(ENV) private _environment: Environment) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InitialData> {
        console.log('claims', this._auth.roles);

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

                        // LogRocket for production only
                        if (this._environment.production) {
                            LogRocket.identify(userDetails.userLoginId, {
                                name: `${userDetails.firstName} ${userDetails.lastName}`,
                                email: userDetails.email
                            });
                        }

                        return {
                            id: userDetails.userLoginId,
                            email: userDetails.email,
                            name: `${userDetails.firstName} ${userDetails.lastName}`,
                            avatar: userDetails.photoUrl || 'assets/images/avatars/profile-blank.jpg',
                            status: 'online'
                        };
                    }))
        ]).pipe(
            map(([messages, navigation, notifications, shortcuts, user]) => {

                let compactNavigation = navigation.compact as FuseNavigationItem[];

                if (!this._auth.roles.includes('Admin')) {
                    const features = ['apps.groups','example'];
                    const filterFeature = (featureId: string, nav: FuseNavigationItem): boolean => nav.id !== featureId;

                    for (const feature of features) {
                        compactNavigation = compactNavigation.filter(n => filterFeature(feature, n))
                    }
                }

                return ({
                    messages,
                    navigation: {
                        compact: compactNavigation,
                        default: navigation.default,
                        futuristic: navigation.futuristic,
                        horizontal: navigation.horizontal
                    },
                    notifications,
                    shortcuts,
                    user
                });

                } // close map
            )
        );
    }
}
