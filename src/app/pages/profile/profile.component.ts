import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ProfileService } from './_services/profile.service';
import { Observable, Subject } from 'rxjs';
import { Profile } from './profile.model';
import { ProfilePhotoFormDialogComponent } from './tabs/about/components';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { FormActions } from '@shared/shared.models';

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation  : ViewEncapsulation.None
})
export class ProfileComponent implements OnDestroy
{
    profile: Profile;
    hoverOverProfileImage = false;

    dialogRef: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(
        private _profileService: ProfileService,
        private _matDialog: MatDialog)
    {
        _profileService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => this.profile = data);
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    log( $event: MouseEvent )
    {
        if ($event.type === 'mouseover') {
            this.hoverOverProfileImage = true;
        } else {
            this.hoverOverProfileImage = false;
        }
    }

    /**
     * Opens the Photo Editor Dialog
     */
    onEditPhoto()
    {
        this.dialogRef = this._matDialog.open(ProfilePhotoFormDialogComponent, {
            panelClass: 'photo-form-form-dialog',
            data : {
                action: FormActions.Edit,
                profile: this.profile
            }
        });
    }
}
