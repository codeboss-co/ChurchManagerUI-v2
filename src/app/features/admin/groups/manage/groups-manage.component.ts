import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GroupMemberForm, GroupMembersSimple, GroupsDataService, GroupWithChildren } from '@features/admin/groups';
import { filter, finalize, map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '@core/notifications/toastr.service';
import { NewGroupForm } from '@features/admin/groups/manage/components/new/new-group.model';
import { GroupsViewerComponent } from '@features/admin/groups/manage/components/list/groups-viewer.component';
import { FormActions } from '@shared/shared.models';
import { MatDrawer } from '@angular/material/sidenav';

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

    @ViewChild(GroupsViewerComponent) viewer!: GroupsViewerComponent;
    @ViewChild('drawer') private _drawer: MatDrawer;

    // Private trigger streams
    private _groupAdded$ = new Subject<NewGroupForm>();
    private _groupMemberDeleted$ = new Subject<{groupMemberId: number; groupId: number}>();
    private _groupMemberAdded$ = new Subject<GroupMemberForm>();
    private _groupMemberUpdated$ = new Subject<GroupMemberForm>();

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _service: GroupsManageService,
        private _data: GroupsDataService,
        private _toastr: ToastrService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void
    {
        // groupId from the route
        const groupId$: Observable<number> = this._activatedRoute.params.pipe(map(({groupId})=> +groupId))

        this.groups$ = this._service.groups$

        // when group Id changes display the selected group
        // means we are coming from Profile page to view a specific group
        const displaySelectedGroup$ = groupId$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(withLatestFrom(this.groups$))
            .pipe(filter(([groupId, _])  => !!groupId))
            .pipe(tap(([_, groups])  => this.onGroupSelected(groups[0])));

        displaySelectedGroup$.subscribe();

        // load group members
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

        // add group and reload the tree
        const addGroupAndUpdateTree$ = this._groupAdded$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                switchMap((group: NewGroupForm) => {
                    return this._data.addGroup$(group)
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
                })
            )

        // once that is done - expand the tree to the new group
        addGroupAndUpdateTree$
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
    }

    onMemberAdded( member: GroupMemberForm )
    {
        this._groupMemberAdded$.next(member);
    }

    onGroupAdded(group: NewGroupForm)
    {
       this._groupAdded$.next(group);
    }

    onMemberDeleted( memberInfo: { groupMemberId: number; groupId: number } )
    {
        this._groupMemberDeleted$.next(memberInfo);
    }

    onMemberUpdated(member: GroupMemberForm)
    {
        this._groupMemberUpdated$.next(member);
    }
}