import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormAction, FormActions } from '@shared/shared.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { missionCategoryList , missionTypes} from '@features/admin/missions';

@Component( {
    selector: 'missions-add-dialog',
    templateUrl: './missions-create-dialog.component.html',
    styleUrls: ['./missions-create-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class MissionsCreateDialogComponent implements OnInit
{
    action: FormAction;
    dialogTitle: string;
    missionStreamCtrl  = new FormControl('Group');
    form: FormGroup;

    missionTypes = missionTypes;
    categoryList = missionCategoryList;

    constructor(
        public matDialogRef: MatDialogRef<MissionsCreateDialogComponent>,
        @Inject( MAT_DIALOG_DATA ) private _data: any,
        private _formBuilder: FormBuilder
    ) {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === FormActions.New)
        {
            this.dialogTitle = 'New Mission: ' + this.missionStreamCtrl.value;
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
     * Create mission form
     *
     * @returns {FormGroup}
     */
    createForm(): FormGroup
    {
        return this._formBuilder.group(
            {
                type: [null, Validators.required],
                category: [null, Validators.required],
                church: [null],
                churchGroup: [null],
                person: [null],
                startDate: [new Date(), Validators.required],
                endDate: [null]
            } );
    }

    add()
    {
      console.log('create mission', this.form.value);
    }
}