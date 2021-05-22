import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GroupMembersSimple, GroupsDataService, GroupWithChildren, NewGroupMemberForm } from '@features/admin/groups';
import { filter, finalize, first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from '@core/notifications/toastr.service';

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
}