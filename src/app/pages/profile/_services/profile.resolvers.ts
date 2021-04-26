import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../profile.model';
import { ProfileService } from './profile.service';
import { ProfileDiscipleshipComponent } from '../tabs/discipleship/profile-discipleship.component';
import { ProfileDiscipleshipService } from '../tabs/discipleship/profile-discipleship.service';
import { DiscipleshipProgramDetails } from '@features/admin/discipleship/discipleship.models';

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

@Injectable()
export class ProfileDiscipleshipResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _service: ProfileDiscipleshipService)
    {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DiscipleshipProgramDetails>
    {
        // Try extract personId from route
        const { personId } = route.params;

        return this._service.getDiscipleshipStepsForPerson$(personId);
    }
}