import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupsDataService, GroupWithChildren } from '@features/admin/groups';

@Component({
    selector       : 'add-group-member-dialog',
    templateUrl    : './add-group-member-form-dialog.component.html',
    styleUrls    : ['./add-group-member-form-dialog.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddGroupMemberFormDialogComponent implements OnInit
{
    form: FormGroup;
    group: GroupWithChildren;

    /**
     * Constructor
     *
     */
    constructor(
        public matDialogRef: MatDialogRef<AddGroupMemberFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _groupsData: GroupsDataService,
        private _formBuilder: FormBuilder
    )
    {
        this.group = _data.group;
    }

    ngOnInit(): void
    {
        this.form = this.createForm();
    }

    /**
     * Create form
     */
    private createForm(): FormGroup
    {
        return this._formBuilder.group({
            person: [null, Validators.required]
        });
    }

    add(): void
    {

    }
}