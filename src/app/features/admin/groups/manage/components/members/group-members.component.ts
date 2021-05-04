import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { GroupMemberSimple, GroupMembersSimple } from '@features/admin/groups';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';

@Component({
    selector       : 'group-members',
    templateUrl    : './group-members.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupMembersComponent implements  OnChanges
{
    @Input() members: GroupMembersSimple;
    @Input() isLoading: boolean = false;

    displayedColumns: string[] = ['select', 'photoUrl', 'firstName', 'lastName', 'gender', 'groupMemberRole'];

    dataSource: MatTableDataSource<GroupMemberSimple> = new MatTableDataSource([]);

    selection = new SelectionModel<GroupMemberSimple>(true, []);

    searchInputControl: FormControl = new FormControl();

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

    }
}