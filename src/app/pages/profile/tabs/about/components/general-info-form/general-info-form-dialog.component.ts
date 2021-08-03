import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BirthDateModel, Profile, ProfileGeneralInfo } from '../../../../profile.model';
import { FormAction, FormActions } from '@shared/shared.models';
import { BirthDate } from '@features/admin/people';

@Component({
    selector     : 'profile-general-info-form-dialog',
    templateUrl  : './general-info-form-dialog.component.html',
    styleUrls    : ['./general-info-form-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileGeneralInfoFormDialogComponent implements OnInit
{
    action: FormAction;
    form: FormGroup;
    profile: Profile;
    dialogTitle: string;

    /**
     * Constructor
     *
     */
    constructor(
        public matDialogRef: MatDialogRef<ProfileGeneralInfoFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: { action: FormAction; profile: Profile },
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;
        this.profile = _data.profile;
        // We might support more actions in future
        if ( this.action === FormActions.Edit )
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
            occupation: [this.profile.occupation],
            phoneNumber: [this.profile.phoneNumbers.length ? this.profile.phoneNumbers[0].number : null],
            email: [this.profile.email?.address, [Validators.email]],
            maritalStatus: [this.profile.maritalStatus],
            birthDate: [
                {
                    day: this.profile.birthDate?.birthDay,
                    month: this.profile.birthDate?.birthMonth,
                    year: this.profile.birthDate?.birthYear,
                }]
        });
    }

    formValues(): ProfileGeneralInfo
    {
        const {occupation, phoneNumber, email, maritalStatus, birthDate} = this.form.value;
        // We need day, month, year as null if left blank
        const birthDateModel = new BirthDateModel(birthDate);
        return {occupation, phoneNumber, email, maritalStatus, birthDate: birthDateModel};
    }
}