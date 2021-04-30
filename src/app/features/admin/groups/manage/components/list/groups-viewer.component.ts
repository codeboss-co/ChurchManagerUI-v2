import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { GroupWithChildren } from '@features/admin/groups';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatDrawer } from '@angular/material/sidenav';

interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

@Component({
    selector       : 'groups-viewer',
    templateUrl    : './groups-viewer.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsViewerComponent implements OnChanges
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';

    @Input() groups: GroupWithChildren[] = [];

    treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);

    dataSource: MatTreeFlatDataSource<GroupWithChildren, FlatNode>;

    private _treeFlattener: MatTreeFlattener<GroupWithChildren, FlatNode>;

    private _transformer = (node: GroupWithChildren, level: number) => {
        return {
            expandable: !!node.groups && node.groups.length > 0,
            name: node.name,
            level: level,
            // optional
            description: node.description
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

    onBackdropClicked() {

    }
}