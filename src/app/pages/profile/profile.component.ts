import { Component, ViewEncapsulation } from '@angular/core';
import { ProfileService } from './_services/profile.service';
import { Observable } from 'rxjs';
import { Profile } from './profile.model';

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation  : ViewEncapsulation.None
})
export class ProfileComponent
{
    profile$: Observable<Profile>;

    /**
     * Constructor
     */
    constructor(private _profileService: ProfileService)
    {
        this.profile$ = _profileService.profile$;
    }
}
