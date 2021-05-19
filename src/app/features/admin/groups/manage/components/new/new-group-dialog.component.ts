import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupsDataService, GroupType, GroupWithChildren } from '@features/admin/groups';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { weekdays} from './calendar.model';


@Component({
    selector       : 'new-group-dialog',
    templateUrl    : './new-group-dialog.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewGroupDialogComponent implements OnInit
{
    form: FormGroup;
    groupType: GroupType;
    weekdays = weekdays;
    parentGroup: GroupWithChildren

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<NewGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { parentGroup: GroupWithChildren },
        private _formBuilder: FormBuilder,
        private _data: GroupsDataService
    )
    {
        this.parentGroup = data.parentGroup;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.form = this._formBuilder.group({
            groupTypeId: [null, Validators.required],
            parentGroupId: [this.parentGroup?.id, Validators.required],
            name: [null, Validators.required],
            description: [null],
            frequency: [null],
            weekly  : this._formBuilder.group({
                byDay: [[]]
            }),
            meetingTime: []
        });

        // Get the group type info
        this.form.get('groupTypeId').valueChanges
            .pipe(
                switchMap(groupTypeId => this._data.getGroupType$(groupTypeId)),
                map(data => this.groupType = data)
            ).subscribe();
    }

}