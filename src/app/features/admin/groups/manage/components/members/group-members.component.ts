import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { GroupMemberSimple, GroupMembersSimple, GroupWithChildren, NewGroupMemberForm } from '@features/admin/groups';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupMemberFormDialogComponent } from './add/add-group-member-form-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector       : 'group-members',
    templateUrl    : './group-members.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupMembersComponent implements OnChanges
{
    @Input() members: GroupMembersSimple;
    @Input() group: GroupWithChildren;
    @Input() isLoading: boolean = false;
    @Output() memberAdded = new EventEmitter<NewGroupMemberForm>();
    @Output() memberDeleted = new EventEmitter<{ groupMemberId: number, groupId: number }>();

    // Fix: https://stackoverflow.com/questions/46786757/angular-matsort-does-not-sort
    private _sort: MatSort;
    @ViewChild(MatSort) set matSort(ms: MatSort) {
        this._sort = ms;
        this._setDataSourceAttributes();
    }
    private _paginator: MatPaginator
    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        this._paginator = mp;
        this._setDataSourceAttributes();
    }

    dialogRef: any;

    displayedColumns: string[] = ['select', 'photoUrl', 'firstName', 'lastName', 'gender', 'groupMemberRole', 'recordStatus', 'actions'];

    dataSource: MatTableDataSource<GroupMemberSimple> = new MatTableDataSource([]);

    selection = new SelectionModel<GroupMemberSimple>(true, []);

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
                this.memberAdded.emit(formData);
            });
    }

    applyFilter(event: Event)
    {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    delete( groupMemberId: number )
    {
        this.memberDeleted.emit({groupMemberId, groupId: this.group.id});
    }

    private _setDataSourceAttributes() : void
    {
        this.dataSource.paginator = this._paginator;
        this.dataSource.sort = this._sort;
    }


}