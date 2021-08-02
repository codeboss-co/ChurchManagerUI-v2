import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ProfileService } from './_services/profile.service';
import { Observable, Subject } from 'rxjs';
import { Profile, ProfilePersonalInfo } from './profile.model';
import { ProfilePhotoFormDialogComponent } from './tabs/about/components';
import { MatDialog } from '@angular/material/dialog';
import { filter, first, map, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { FormActions } from '@shared/shared.models';
import { FormGroup } from '@angular/forms';
import { FileUploadService } from '@shared/api/file-upload.service';

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
        private _uploader: FileUploadService,
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

        const afterClosed$ =  this.dialogRef.afterClosed()
            .pipe(withLatestFrom(this._profileService.profile$))
            .pipe(
                filter(([response, _]) => !!response), // <-- only "truthy" results pass same as if(result)
                first(), // <-- completes the observable and unsubscribes,
                switchMap(([response, profile]) => {
                    console.log(response);
                    const actionType: string = response[0];
                    const file: string = response[1];
                    switch ( actionType )
                    {
                        /**
                         * Save
                         */
                        case 'save':
                            return this._profileService.profile$;
                    }
                })
            );

        afterClosed$
            .pipe(
                switchMap((profile: Profile) => {
                    // Calls the endpoint to update the profile
                    return this._profileService.getUserProfile$(+profile.personId);
                } ))
            .subscribe(
                value => {},
                error => {},
                () => console.log('Add Photo completed')
            );
    }
}
