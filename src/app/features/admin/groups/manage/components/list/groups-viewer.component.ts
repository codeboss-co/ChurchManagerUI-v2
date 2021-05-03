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

    treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);

    dataSource: MatTreeFlatDataSource<GroupWithChildren, FlatNode>;

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<number, GroupWithChildren>();

    private _treeFlattener: MatTreeFlattener<GroupWithChildren, FlatNode>;

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

    hasChild = (_: number, node: FlatNode) => node.expandable;

    constructor()
    {
        this._treeFlattener = new MatTreeFlattener(
            this._transformer, node => node.level, node => node.expandable, node => node.groups)

        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this._treeFlattener);
    }

    ngOnChanges( changes: SimpleChanges ): void
    {
        if ( changes['groups'] ) {
            this.dataSource.data = changes['groups'].currentValue;
        }
    }

    onSelectGroup( { item }: FlatNode ): void
    {
        const selectedGroup = this.flatNodeMap.get(item.id);
        this.selectedGroup.emit(selectedGroup);
    }
}