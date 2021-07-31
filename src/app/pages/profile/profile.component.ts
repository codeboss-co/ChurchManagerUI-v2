import { Component, ViewEncapsulation } from '@angular/core';
import { ProfileService } from './_services/profile.service';
import { Observable } from 'rxjs';
import { Profile } from './profile.model';
import { ProfileGeneralInfoFormDialogComponent, ProfilePhotoFormDialogComponent } from './tabs/about/components';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation  : ViewEncapsulation.None
})
export class ProfileComponent
{
    profile$: Observable<Profile>;
    hoverOverProfileImage = false;

    dialogRef: any;


    /**
     * Constructor
     */
    constructor(
        private _profileService: ProfileService,
        private _matDialog: MatDialog)
    {
        this.profile$ = _profileService.profile$;
    }

    log( $event: MouseEvent )
    {
        if ($event.type === 'mouseover') {
            this.hoverOverProfileImage = true;
        } else {
            this.hoverOverProfileImage = false;
        }
    }

    onEditPhoto()
    {
        this.dialogRef = this._matDialog.open(ProfilePhotoFormDialogComponent, {
            panelClass: 'photo-form-form-dialog',
            data : {
                action: 'edit',
                //profile: this.profile$.getValue()
            }
        });
    }
}
