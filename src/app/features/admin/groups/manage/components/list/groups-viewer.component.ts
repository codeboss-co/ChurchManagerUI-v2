import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { Group, GroupWithChildren } from '@features/admin/groups';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { NewGroupDialogComponent } from '@features/admin/groups/manage/components/new/new-group-dialog.component';

interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
    item: GroupWithChildren;
}

@Component({
    selector       : 'groups-viewer',
    templateUrl    : './groups-viewer.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsViewerComponent implements OnChanges
{
    @Input() groups: GroupWithChildren[] = [];
    @Output() selectedGroup = new EventEmitter<GroupWithChildren>();
    @Output() addedGroup = new EventEmitter<Group>();

    treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);

    dataSource: MatTreeFlatDataSource<GroupWithChildren, FlatNode>;

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<number, GroupWithChildren>();
    hasChild = (_: number, node: FlatNode) => node.expandable;
    private _treeFlattener: MatTreeFlattener<GroupWithChildren, FlatNode>;

    /**
     * Constructor
     */
    constructor(private _matDialog: MatDialog)
    {
        this._treeFlattener = new MatTreeFlattener(
            this._transformer, node => node.level, node => node.expandable, node => node.groups);

        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this._treeFlattener);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnChanges( changes: SimpleChanges ): void
    {
        if ( changes['groups'] ) {
            this.dataSource.data = changes['groups'].currentValue;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onSelectGroup( { item }: FlatNode ): void
    {
        const selectedGroup = this.flatNodeMap.get(item.id);
        this.selectedGroup.emit(selectedGroup);
    }

    /**
     * Open new group dialog
     */
    openAddGroupDialog({ item }: FlatNode): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(NewGroupDialogComponent, {
            data : {
                parentGroup: item
            }
        });

        dialogRef.afterClosed()
            .subscribe((result) => {
                console.log('Compose dialog was closed!', result);
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------
    private _transformer = (node: GroupWithChildren, level: number) => {
        // While transforming add the item to the map
        this.flatNodeMap.set(node.id, node);

        return {
            expandable: !!node.groups && node.groups.length > 0,
            name: node.name,
            level: level,
            // optional
            item: node
        };
    }
}