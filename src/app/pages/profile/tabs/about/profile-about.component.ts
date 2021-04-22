import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FuseAnimations } from '@fuse/animations';

import { Profile } from '../../profile.model';
import { ProfileService } from '../../profile.service';
import { ProfileConnectionInfoFormDialogComponent } from './components/connection-info-form/connection-info-form-dialog.component';
import { FormGroup } from '@angular/forms';
import { ProfileGeneralInfoFormDialogComponent } from './components/general-info-form/general-info-form-dialog.component';

@Component({
    selector       : 'profile-main',
    templateUrl    : './profile-about.component.html',
    encapsulation  : ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class ProfileAboutComponent implements OnInit, OnDestroy
{
    profile$ = new BehaviorSubject<Profile>(null);

    dialogRef: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(
        private _profileService: ProfileService,
        private _matDialog: MatDialog,
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._profileService.profile$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(tap(profile => this.profile$.next(profile)))
            .subscribe();
    }

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
    // @ Edit Profile Dialogs
    // -----------------------------------------------------------------------------------------------------

    onEditGeneralInfo(): void
    {
        this.dialogRef = this._matDialog.open(ProfileGeneralInfoFormDialogComponent, {
            panelClass: 'general-info-form-form-dialog',
            data : {
                action: 'edit',
                profile: this.profile$.getValue()
            }
        });

        const afterClosed$ = combineLatest([this.dialogRef.afterClosed(), this.profile$])
            .pipe(
                filter(([response, _]) => !!response), // <-- only "truthy" results pass same as if(result)
                first(), // <-- completes the observable and unsubscribes,
                switchMap(([response, profile]) => {
                    const actionType: string = response[0];
                    const formData: FormGroup = response[1];
                    switch ( actionType )
                    {
                        /**
                         * Save
                         */
                        case 'save':
                            return this._profileService.editConnectionInfo$(profile.personId, formData.getRawValue());
                    }
                })
            );

        afterClosed$.subscribe(
            value => {},
            error => {},
            () => console.log('completed')
        );
    }
}
