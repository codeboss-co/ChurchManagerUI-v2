import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ProfileService } from './_services/profile.service';
import { Subject } from 'rxjs';
import { Profile } from './profile.model';
import { ProfilePhotoFormDialogComponent } from './tabs/about/components';
import { MatDialog } from '@angular/material/dialog';
import { filter, first, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { FormActions } from '@shared/shared.models';
import { FileUploadService } from '@shared/api/file-upload.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ToastrService } from '@core/notifications/toastr.service';

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
        private _matDialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _toastr: ToastrService
    )
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
                            return this._profileService.getUserProfile$(+profile.personId);
                    }
                })
            );

        afterClosed$
            .subscribe(
                value => {},
                error => {},
                () => console.log('Add Photo completed')
            );
    }

    onDeletePhoto()
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete Picture',
            message: 'Do you want to remove the profile picture?',
            actions: {
                confirm: {
                    label: 'Confirm'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        const deletePhoto$ = confirmation.afterClosed()
            .pipe(withLatestFrom(this._profileService.profile$))
            .pipe(
                switchMap(([result, profile]) => {
                    // If the confirm button pressed...
                    if ( result === 'confirmed' )
                    {
                        return this._profileService.deletePhoto$(+profile.personId);
                    }
                })
            );

        deletePhoto$
            .pipe(withLatestFrom(this._profileService.profile$))
            .pipe(
                switchMap(([_, profile])  => this._profileService.getUserProfile$(+profile.personId))
            )
            .subscribe((result) => {
                // let the user know they are successfully subscribed
                this._toastr.success(
                    'Picture successfully deleted.',
                    null,
                    {
                        duration: 2000
                    }
                );
            });
    }
}
