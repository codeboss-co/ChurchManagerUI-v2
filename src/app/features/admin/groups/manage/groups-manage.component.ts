import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GroupMembersSimple, GroupsDataService, GroupWithChildren, NewGroupMemberForm } from '@features/admin/groups';
import { filter, finalize, first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '@core/notifications/toastr.service';
import { NewGroupForm } from '@features/admin/groups/manage/components/new/new-group.model';
import { GroupsViewerComponent } from '@features/admin/groups/manage/components/list/groups-viewer.component';

@Component({
    selector       : 'groups-manage',
    templateUrl    : './groups-manage.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsManageComponent
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

    onGroupSelected( selected: GroupWithChildren ): void
    {
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

    onGroupAdded(group: NewGroupForm)
    {
        this._data.addGroup$(group)
            .pipe(first())
            .pipe(
                switchMap((groupId: number) => {
                    // Depending on where we are coming from
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
                const viewer = this.viewer;
                // Update the data
                viewer.dataSource.data = groups;
                // Expand the tree to from the new node
                viewer.expandTree(viewer.treeControl.dataNodes, groupId);
                // Show the new groups details
                const newGroup = viewer.treeControl.dataNodes.find(x => x.item.id === groupId)?.item;
                this.selectedGroup$.next(newGroup);
            });

    }


}