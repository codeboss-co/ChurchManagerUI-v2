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
import { GroupsDataService, GroupWithChildren } from '@features/admin/groups';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { NewGroupDialogComponent } from '@features/admin/groups/manage/components/new/new-group-dialog.component';
import { filter, finalize, first, tap } from 'rxjs/operators';
import { NewGroupForm } from '@features/admin/groups/manage/components/new/new-group.model';
import { BehaviorSubject } from 'rxjs';
import { FormActions } from '@shared/shared.models';

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
    @Output() loadedChildren = new EventEmitter<GroupWithChildren>();
    @Output() addedGroup = new EventEmitter<NewGroupForm>();

    selected: GroupWithChildren;
    isLoading$ = new BehaviorSubject(false);
    treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);

    dataSource: MatTreeFlatDataSource<GroupWithChildren, FlatNode>;

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<number, GroupWithChildren>();
    hasChild = (_: number, node: FlatNode) => node.expandable;
    private _treeFlattener: MatTreeFlattener<GroupWithChildren, FlatNode>;

    // Map from parent to its children. This gets filled as we load data lazily
    parentChildrenMap = new Map<number, GroupWithChildren[]>();

    /**
     * Constructor
     */
    constructor(private _matDialog: MatDialog, private _data: GroupsDataService)
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
            // Update data source
            this.dataSource.data = changes['groups'].currentValue;
            // Add groups to the loaded map
            this.dataSource.data.forEach(group => {
                if (!this.parentChildrenMap.has(group.parentGroupId)) {
                    this.parentChildrenMap.set(group.parentGroupId, group.groups)
                }
            });
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
                action: FormActions.New,
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
    private _transformer = (node: GroupWithChildren, level: number): FlatNode => {
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

    // https://docs.google.com/presentation/d/1BoJ-jq-O9zQHAps7LVciiiH9WI9dDqqv-LAlQ6iMh5o/htmlpresent
    // https://stackblitz.com/edit/material-tree-dynamic?file=app%2Fapp.component.ts
    loadChildren(node: FlatNode)
    {
        this.loadedChildren.emit(node.item);
        if (!this.flatNodeMap.has(node.item.id)) {
            return;
        }

        const parent = this.flatNodeMap.get(node.item.id)!;
        let children = this.parentChildrenMap.get(node.item.id)!;

        // Already loaded
        if (parent.groups!.length > 0) {
            return;
        }

        // Fetch parent with children from server
        if (!children) {
            this.isLoading$.next(true);
            this._data.getGroupTree$(node.item.id)
                .pipe(first())
                .subscribe(group => {
                    // Assign loaded children to parent
                    children = group[0].groups;
                    // Update children map
                    this.parentChildrenMap.set(node.item.id, children);
                    // Update the node with the children
                    const foundNode = this.treeControl.dataNodes.find(x => x.item.id === node.item.id);
                    foundNode.expandable = true;
                    foundNode.item.groups = children;
                    // Update data source
                    this.dataSource.data = this.groups;
                    // Expand the tree from the new node
                    this.expandTree(this.treeControl.dataNodes, node.item.id);
                    // Stop loading indicator
                    this.isLoading$.next(false);
                })
        }
    }

    reload(groups: GroupWithChildren[]) {
        // Update data source
        this.dataSource.data = groups;
    }
}