import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { GroupMemberSimple, GroupMembersSimple, GroupWithChildren, NewGroupMemberForm } from '@features/admin/groups';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupMemberFormDialogComponent } from './add/add-group-member-form-dialog.component';

@Component({
    selector       : 'group-members',
    templateUrl    : './group-members.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupMembersComponent implements  OnChanges
{
    @Input() members: GroupMembersSimple;
    @Input() group: GroupWithChildren;
    @Input() isLoading: boolean = false;
    dialogRef: any;

    displayedColumns: string[] = ['select', 'photoUrl', 'firstName', 'lastName', 'gender', 'groupMemberRole'];

    dataSource: MatTableDataSource<GroupMemberSimple> = new MatTableDataSource([]);

    selection = new SelectionModel<GroupMemberSimple>(true, []);

    searchInputControl: FormControl = new FormControl();

    constructor(private _matDialog: MatDialog) {
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(): boolean
    {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void
    {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    ngOnChanges( changes: SimpleChanges ): void
    {
        if ( changes['members'] ) {
            this.dataSource.data = changes['members'].currentValue;
            // this.dataSource._updateChangeSubscription();
        }
    }

    addGroupMember(): void
    {
        this.dialogRef = this._matDialog.open(AddGroupMemberFormDialogComponent, {
            panelClass: 'add-group-member-form-dialog',
            data      : {
                action: 'new',
                group: this.group
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response) => {
                if ( !response )
                {
                    return;
                }

                const actionType: string = response[0];
                const formData: NewGroupMemberForm = response[1];

                // Do something here
                console.log( 'formData', formData );
            });
    }
}