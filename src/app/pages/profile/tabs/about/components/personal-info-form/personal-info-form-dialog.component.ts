import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Profile } from '../../../../profile.model';

@Component({
    selector     : 'profile-personal-info-form-dialog',
    templateUrl  : './personal-info-form-dialog.component.html',
    styleUrls    : ['./personal-info-form-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePersonalInfoFormDialogComponent implements OnInit
{
    action: string;
    form: FormGroup;
    profile: Profile;
    dialogTitle: string;

    /**
     * Constructor
     *
     */
    constructor(
        public matDialogRef: MatDialogRef<ProfilePersonalInfoFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { action: string, profile: Profile },
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;
        this.profile = _data.profile;
        // We might support more actions in future
        if ( this.action === 'edit' )
        {
            this.dialogTitle = `Editing: ${this.profile.fullName.firstName} ${this.profile.fullName.lastName}`;
        }

        this.form = this.createForm();
    }

    ngOnInit(): void
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createForm(): FormGroup
    {
        return this._formBuilder.group({
            firstName: [this.profile.fullName.firstName, [Validators.required]],
            middleName: [this.profile.fullName.middleName],
            lastName: [this.profile.fullName.lastName, [Validators.required]],
            ageClassification: [this.profile.ageClassification],
            gender: [this.profile.gender]
        });
    }
}