import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupsDataService, GroupTypeRole, GroupWithChildren } from '@features/admin/groups';
import { Observable } from 'rxjs/internal/Observable';

@Component({
    selector       : 'add-group-member-dialog',
    templateUrl    : './add-group-member-form-dialog.component.html',
    //styleUrls    : ['./add-group-member-form-dialog.component.scss'],
    encapsulation  : ViewEncapsulation.None
})
export class AddGroupMemberFormDialogComponent implements OnInit
{
    form: FormGroup;
    group: GroupWithChildren;

    groupRoles$: Observable<GroupTypeRole[]>;

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
        console.log( '_data', _data, '' );
    }

    ngOnInit(): void
    {
        this.form = this.createForm();

        this.groupRoles$ = this._groupsData.getGroupRoles$(this.group.groupType.id);
    }

    /**
     * Create form
     */
    private createForm(): FormGroup
    {
        return this._formBuilder.group({
            person: [null, Validators.required],
            groupRole: [null, Validators.required],
            communication: ['Email', Validators.required],
            firstVisitDate: [null],
        });
    }

    add(): void
    {

    }
}