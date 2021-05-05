import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupsDataService, GroupTypeRole, GroupWithChildren, NewGroupMemberForm } from '@features/admin/groups';
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
    action: string;
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
        // Set the defaults
        this.group = _data.group;
        this.action = _data.action;
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
            communicationPreference: ['Email', Validators.required],
            firstVisitDate: [null],
        });
    }

    add(): void
    {
        const {person, groupRole, communicationPreference, firstVisitDate} = this.form.value;

        const model: NewGroupMemberForm = {
            person, groupRole, communicationPreference, firstVisitDate,
            groupId: this.group.id
        };

        this.matDialogRef.close(['new', model]);
    }
}