import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';

@Injectable()
export class ProfileResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _profileService: ProfileService)
    {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Profile>
    {
        // Try extract personId from route
        const { personId } = route.params;

        return this._profileService.getUserProfile$(personId);
    }
}