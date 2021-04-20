import { Component, ViewEncapsulation } from '@angular/core';
import { Profile } from '../../profile.model';
import { Observable } from 'rxjs';
import { ProfileService } from '../../profile.service';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
    selector       : 'profile-main',
    templateUrl    : './profile-about.component.html',
    encapsulation  : ViewEncapsulation.None
})
export class ProfileAboutComponent
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
