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
import { GroupWithChildren } from '@features/admin/groups';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { NewGroupDialogComponent } from '@features/admin/groups/manage/components/new/new-group-dialog.component';
import { filter } from 'rxjs/operators';
import { NewGroupForm } from '@features/admin/groups/manage/components/new/new-group.model';
import { SelectionModel } from '@angular/cdk/collections';

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
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsViewerComponent implements OnChanges
{
    @Input() groups: GroupWithChildren[] = [];
    @Output() selectedGroup = new EventEmitter<GroupWithChildren>();
    @Output() addedGroup = new EventEmitter<{group: NewGroupForm, parent: FlatNode}>();

    treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);

    dataSource: MatTreeFlatDataSource<GroupWithChildren, FlatNode>;

    expansionModel = new SelectionModel<number>(true, []);


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
        console.log('changed');
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
                this.addedGroup.emit({group, parent: node});
                //node.item.groups.push({name: group.name})
                //this.dataSource.data = [...this.dataSource.data];

                // https://github.com/cantidio/node-tree-flatten/blob/master/src/tree-flatten.js
                /*function flattenTree(root, key) {
                    let flatten = [Object.assign({}, root)];
                    delete flatten[0][key];

                    if (root[key] && root[key].length > 0) {
                        return flatten.concat(root[key]
                            .map((child)=>flattenTree(child, key))
                            .reduce((a, b)=>a.concat(b), [])
                        );
                    }

                    return flatten;
                }

                const allGroups = this.dataSource.data.map(g => flattenTree(g, 'groups'))
                const flattened = arr => [].concat(...arr);
                // Find the added group in the returned data
                const flatGroups =  flattened(allGroups);

                const expandNode = (group: GroupWithChildren) => {
                    const node = this.treeControl.dataNodes.find(x => x.item.name === group.name);
                    this.treeControl.expand(node);
                    console.log('group', group);
                    if (group.parentGroupId) {
                        const parent = flatGroups.find(x => x.id === group.parentGroupId);
                        if (parent) expandNode(parent);
                    }
                };

                expandNode(node.item);*/
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