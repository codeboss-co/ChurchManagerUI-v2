import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
    Group,
    GroupMembersSimple,
    GroupsDataService,
    GroupWithChildren,
    NewGroupMemberForm
} from '@features/admin/groups';
import { filter, finalize, first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '@core/notifications/toastr.service';
import { NewGroupForm } from '@features/admin/groups/manage/components/new/new-group.model';
import { FlatNode, GroupsViewerComponent } from '@features/admin/groups/manage/components/list/groups-viewer.component';

@Component({
    selector       : 'groups-manage',
    templateUrl    : './groups-manage.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsManageComponent implements AfterViewInit
{
    groups$: Observable<GroupWithChildren[]>;
    selectedGroup$ = new BehaviorSubject<GroupWithChildren>(null);
    selectedGroup: GroupWithChildren;
    members$: Observable<GroupMembersSimple>;
    loading$ = new BehaviorSubject(true);

    @ViewChild(GroupsViewerComponent) viewer!: GroupsViewerComponent;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _service: GroupsManageService,
        private _data: GroupsDataService,
        private _toastr: ToastrService)
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.groups$ = _service.groups$
            .pipe(
                tap(groups => {
                    // If we are coming from profile page and there are groups
                    // set the selected group to the first one
                    if ( groups && this._activatedRoute.snapshot?.data?.from === 'profile' ) {
                        this.onGroupSelected(groups[0]);
                    }
                })
            );

        this.members$ = this.selectedGroup$
            .pipe(takeUntil(this._unsubscribeAll))
            // might be null because we using behavior subject
            .pipe(filter(groups => !!groups))
            .pipe(tap(_ => this.loading$.next(true)))
            .pipe(
                switchMap(group => {
                    return this._data.getGroupMembers$(group.id)
                        .pipe(finalize(() => this.loading$.next(false)));
                })
            );
    }

    ngAfterViewInit(): void {
        //this.viewer.treeControl.dataNodes.forEach(x => this.viewer.treeControl.expand(x))
    }

    onGroupSelected( selected: GroupWithChildren ): void {
        this.selectedGroup = selected;
        this.selectedGroup$.next(selected);
    }

    onMemberAdded( member: NewGroupMemberForm )
    {
        this._data.addGroupMember$(member)
            .pipe(first())
            .pipe(tap(response => {
                if ( response ) {
                    // Forces  reload of the members
                    this.onGroupSelected(this.selectedGroup)
                } else {
                    this._toastr.info(`${member.person.label} is already a member of this group`)
                }
             }))
            .subscribe()
    }

    onGroupAdded(event: {group: NewGroupForm, parent: FlatNode})
    {

        this._data.addGroup$(event.group)
            .pipe(first())
            .pipe(
                switchMap((groupId: number) => {
                    if ( this._activatedRoute.snapshot?.data?.from === 'profile' ) {
                        return this._data.getGroupTree$(this._activatedRoute.snapshot.params["groupId"])
                            .pipe(
                                map( groups => ({groupId, groups}) )
                            );
                    } else {
                        return this._data.getGroupsTree$()
                            .pipe(
                                map( groups => ({groupId, groups}) )
                            );
                    }
                })
            )
            .subscribe(({groupId, groups}) => {
                console.log('groupId', groupId, '');
                console.log('data', groups, '');

                const viewer = this.viewer;
                viewer.dataSource.data = groups;

                // https://github.com/cantidio/node-tree-flatten/blob/master/src/tree-flatten.js
                function flattenTree(root, key) {
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

                // returns array of groups
                const allGroups = groups.map(g => flattenTree(g, 'groups'))
                const flattened = arr => [].concat(...arr);


                const expandNode = (data: GroupWithChildren[], uniqueId: number) => {
                    data.forEach(group => {

                        if (group.groups && group.groups.find(c => c.id === uniqueId)) {
                            const node = viewer.treeControl.dataNodes.find(n => n.item.id === uniqueId);
                            if (node) {
                                console.log('node', node);
                                viewer.treeControl.expand(node);
                                expandNode([group], group.parentGroupId);
                            }
                        }
                        else if (group.parentGroupId === null) {
                            const root = viewer.treeControl.dataNodes.find(n => n.item.parentGroupId === null);
                            console.log('root', root);
                            viewer.treeControl.expand(root);
                        }
                        else if (group.groups) {
                            expandNode(group.groups, uniqueId);
                        }
                    });
                };

                expandNode(groups, groupId);


                //expand(groups, addedGroup.id);

            });
           /* .pipe(
                switchMap(_ => {
                    if ( this._activatedRoute.snapshot?.data?.from === 'profile' ) {
                        return this._service.getGroupTree$(this._activatedRoute.snapshot.params["groupId"])
                    } else {
                        return this._service.getGroupsTree$()
                    }
                })
            ).subscribe(
                groups => {
                    console.log('data', groups, '');

                    // https://github.com/cantidio/node-tree-flatten/blob/master/src/tree-flatten.js
                    function flattenTree(root, key) {
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

                    // returns array of groups
                    const allGroups = groups.map(g => flattenTree(g, 'groups'))
                    const flattened = arr => [].concat(...arr);
                    // Find the added group in the returned data
                    const addedGroup =  flattened(allGroups)
                        .find((g: GroupWithChildren) =>
                            g.name === event.group.name &&
                            g.description === event.group.description &&
                            g.parentGroupId === event.group.parentGroupId);

                    // flattened groups list
                    const flatGroups =  flattened(allGroups);

                    this.onGroupSelected(addedGroup)

                    const expandNode = (group: GroupWithChildren) => {
                        const node = this.viewer.treeControl.dataNodes.find(x => x.item.name === group.name);
                        this.viewer.treeControl.expand(node);
                        console.log('group', group);
                        if (group.parentGroupId) {
                            const parent = flatGroups.find(x => x.id === group.parentGroupId);
                            if (parent) expandNode(parent);
                        }
                    };

                    expandNode(event.parent);
                }
        );*/
    }


}