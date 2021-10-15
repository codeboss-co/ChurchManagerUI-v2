import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { GroupMemberForm, GroupMembersSimple, GroupsDataService, GroupWithChildren } from '@features/admin/groups';
import { filter, finalize, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '@core/notifications/toastr.service';
import { EditGroupForm, NewGroupForm } from '@features/admin/groups/manage/components/group-detail/group-detail.model';
import { GroupsViewerComponent } from '@features/admin/groups/manage/components/list/groups-viewer.component';
import { FormActions } from '@shared/shared.models';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
    selector       : 'groups-manage',
    templateUrl    : './groups-manage.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsManageComponent implements OnInit, OnDestroy
{
    groups$: Observable<GroupWithChildren[]>;
    selectedGroup$ = new BehaviorSubject<GroupWithChildren>(null);
    selectedGroup: GroupWithChildren;
    members$: Observable<GroupMembersSimple>;
    loading$ = new BehaviorSubject(true);

    isScreenSmall: boolean;

    @ViewChild(GroupsViewerComponent) viewer!: GroupsViewerComponent;
    @ViewChild('drawer') private _drawer: MatDrawer;

    // Private trigger streams
    private _groupAdded$ = new Subject<NewGroupForm>();
    private _groupEdited$ = new Subject<EditGroupForm>();
    private _groupMemberDeleted$ = new Subject<{groupMemberId: number; groupId: number}>();
    private _groupMemberAdded$ = new Subject<GroupMemberForm>();
    private _groupMemberUpdated$ = new Subject<GroupMemberForm>();
    private _groupMembersReloadTrigger$ = new BehaviorSubject<void>(null);

    // Private
    private _unsubscribeAll = new Subject<void>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _service: GroupsManageService,
        private _data: GroupsDataService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _toastr: ToastrService,
        private _cdRef: ChangeDetectorRef)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void
    {
        // groupId from the route
        const groupId$: Observable<number> = this._activatedRoute.params.pipe(map(({groupId})=> +groupId));

        this.groups$ = this._service.groups$;

        // when group Id changes display the selected group
        // means we are coming from Profile page to view a specific group
        const displaySelectedGroup$ = groupId$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(withLatestFrom(this.groups$))
            .pipe(filter(([groupId, _])  => !!groupId))
            .pipe(tap(([_, groups])  => {
                this.onGroupSelected(groups[0]);
            }));

        displaySelectedGroup$.subscribe();

        const reloadGroupMembers$ = this._groupMembersReloadTrigger$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(withLatestFrom(this.selectedGroup$))
            .pipe(filter(([_, group]) => !!group));

        // load group members
        this.members$ = reloadGroupMembers$
            .pipe(tap(_ => this.loading$.next(true)))
            .pipe(
                switchMap(([_, group]) => {
                    return this._data.getGroupMembers$(group.id)
                        .pipe(finalize(() => this.loading$.next(false)));
                })
            );

        // add group and reload the tree
        const editGroupAndReloadGroupWithChildren$ = this._groupEdited$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                switchMap((group: EditGroupForm) => this._data.editGroup$(group)
                        .pipe(map(editedGroup => ({ editedGroup, parentGroupId: group.parentChurchGroup.groupId }) )))
            );

        editGroupAndReloadGroupWithChildren$
            .subscribe(({editedGroup, parentGroupId}) => {
                const viewer = this.viewer;
                // Copy return data to the group in the tree
                const group = viewer.treeControl.dataNodes.find(x => x.item.id === editedGroup.id)?.item;
                Object.assign(group, editedGroup);
                // Update the group detail panel also
                this.selectedGroup$.next(editedGroup);
                // Reload the group data to update the tree
                viewer.refreshTree();
                // Expand the tree from the node
                viewer.expandTree(viewer.treeControl.dataNodes, group.id);
            });

        // add group and reload the tree
        const addGroupAndReloadGroupWithChildren$ = this._groupAdded$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                switchMap((group: NewGroupForm) => {
                    return this._data.addGroup$(group)
                        .pipe(map(groupId => ({ groupId, parentGroupId: group.parentChurchGroup.groupId }) ));
                })
            );

        // once that is done - expand the tree to the new group
        addGroupAndReloadGroupWithChildren$
            .pipe(
                switchMap(({ groupId, parentGroupId}) => this._data.getGroupTree$(parentGroupId)
                    .pipe(map(groups => ({groupId, groups}) ))
                )
            )
            .subscribe(({groupId, groups}) => {
                const viewer = this.viewer;

                // Update the data
                const parent = groups[0];
                const parentNode = viewer.treeControl.dataNodes.find(x => x.item.id === parent.id);
                parentNode.expandable = true;
                parentNode.item.groups = parent.groups;

                // Reload the group data
                const updatedGroups: GroupWithChildren[] = viewer.treeControl.dataNodes.map(x => x.item);
                viewer.dataSource.data = updatedGroups;
                // Expand the tree from the new node
                viewer.expandTree(viewer.treeControl.dataNodes, groupId);
                // Show the new groups details
                const newGroup = viewer.treeControl.dataNodes.find(x => x.item.id === groupId)?.item;
                this.onGroupSelected(newGroup);
                // So that the newly selected is the only one selected
                this._cdRef.markForCheck();
            });

        // add group member and reload the members
        const addMemberAndReload$ = this._groupMemberAdded$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                switchMap(member => {
                    return this._data.addOrUpdateGroupMember$(member)
                        .pipe(tap(response => {
                            if ( response ) {
                                // Forces  reload of the members
                                this.onGroupSelected(this.selectedGroup)
                            } else {
                                this._toastr.info(`${member.person.label} is already a member of this group`)
                            }
                        }))
                })
            );

        addMemberAndReload$.subscribe();

        this._groupMemberDeleted$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(switchMap(memberInfo => {

                return this._data.deleteGroupMember$(memberInfo)
                    .pipe(tap(response => {
                        if ( response ) {
                            // Forces  reload of the members
                            this.onGroupSelected(this.selectedGroup)
                        }
                    }));

            }))
            .subscribe();

        // update group member and reload
        const updateMemberAndReload$ = this._groupMemberUpdated$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                switchMap(member => {
                    return this._data.addOrUpdateGroupMember$(member, FormActions.Edit)
                        .pipe(tap(response => {
                            if ( response ) {
                                // Forces  reload of the members
                                this.onGroupSelected(this.selectedGroup)
                            } else {
                                this._toastr.info(`${member.person.label} is already a member of this group`)
                            }
                        }))
                })
            );

        updateMemberAndReload$.subscribe();

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('sm'); // was "md"
            });
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle Drawer
     */
    toggleDrawer(): void
    {
        // Toggle the drawer
        this._drawer.toggle();
    }

    onGroupSelected( selected: GroupWithChildren ): void
    {
        this.selectedGroup = selected;
        this.selectedGroup$.next(selected);
        this._groupMembersReloadTrigger$.next();
    }

    onMemberAdded( member: GroupMemberForm )
    {
        this._groupMemberAdded$.next(member);
    }

    onGroupAdded(group: NewGroupForm)
    {
       this._groupAdded$.next(group);
    }

    onGroupEdited(group: EditGroupForm)
    {
        this._groupEdited$.next(group);
    }

    onMemberDeleted( memberInfo: { groupMemberId: number; groupId: number } )
    {
        this._groupMemberDeleted$.next(memberInfo);
    }

    onMemberUpdated(member: GroupMemberForm)
    {
        this._groupMemberUpdated$.next(member);
    }

    onLoadChildren(node: GroupWithChildren)
    {
    }
}