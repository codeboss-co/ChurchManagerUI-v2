import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GroupsDataService, GroupType } from '@features/admin/groups';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';

@Component({
    selector       : 'new-group-dialog',
    templateUrl    : './new-group-dialog.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewGroupDialogComponent implements OnInit
{
    form: FormGroup;
    groupType$: Observable<GroupType>;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<NewGroupDialogComponent>,
        private _formBuilder: FormBuilder,
        private _data: GroupsDataService
    )
    {
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
            groupType: [null, Validators.required],
            name: [null, Validators.required],
            description: [null],
        });

        this.groupType$ = this.form.get('groupType').valueChanges
            .pipe(
                switchMap(groupTypeId => this._data.getGroupType$(groupTypeId))
            );
    }

}