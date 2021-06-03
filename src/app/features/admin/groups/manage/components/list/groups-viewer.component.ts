import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { GroupWithChildren } from '@features/admin/groups';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { NewGroupDialogComponent } from '@features/admin/groups/manage/components/new/new-group-dialog.component';
import { filter } from 'rxjs/operators';
import { NewGroupForm } from '@features/admin/groups/manage/components/new/new-group.model';

export interface FlatNode {
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
    @Output() addedGroup = new EventEmitter<NewGroupForm>();

    selected: GroupWithChildren;

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
        this.selected = selectedGroup;
        this.selectedGroup.emit(selectedGroup);
    }

    /**
     * Open new group dialog
     */
    openAddGroupDialog(node: FlatNode): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(NewGroupDialogComponent, {
            data : {
                parentGroup: node.item
            }
        });

        dialogRef.afterClosed()
            .pipe(filter(result => !!result))
            .subscribe((group: NewGroupForm) => {
                // Signal the added group details
                this.addedGroup.emit(group);
            });
    }

    /**
     * Expands tree from given node to all its parent
     * https://stackblitz.com/edit/angular-icfxva?file=src%2Fapp%2Ftree-nested-overview-example.ts
     */
    expandTree( data: FlatNode[], id: number): any {
        data.forEach(node => {
            if (node.item.groups && node.item.groups.find(c => c.id === id)) {
                this.treeControl.expand(node);
                this.expandTree(this.treeControl.dataNodes, node.item.id);
            }
            else if (node.item.groups && node.item.groups.find(c => c.groups)) {
                this.expandTree(node.item.groups.map(this._transformer), id);
            }
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