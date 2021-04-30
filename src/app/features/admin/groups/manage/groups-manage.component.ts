import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { Observable } from 'rxjs';
import { GroupWithChildren } from '@features/admin/groups';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { tap } from 'rxjs/internal/operators/tap';

interface FlatNode {
    expandable: boolean;
    name: string;
    level: number;
}

@Component({
    selector       : 'groups-manage',
    templateUrl    : './groups-manage.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsManageComponent implements OnInit
{

    groups$: Observable<GroupWithChildren[]>;

    groups: GroupWithChildren[] = [];

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

    constructor(private _service: GroupsManageService)
    {
        this.groups$ = _service.groups$;

        this._treeFlattener = new MatTreeFlattener(
            this._transformer, node => node.level, node => node.expandable, node => node.groups)

        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this._treeFlattener);
    }

    ngOnInit(): void
    {
        this._service.groups$
            .pipe(
                tap(groups => this.dataSource.data = groups)
            )
            .subscribe();
    }

}