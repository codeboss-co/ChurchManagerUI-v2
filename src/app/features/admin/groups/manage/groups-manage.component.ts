import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GroupMembersSimple, GroupsDataService, GroupWithChildren } from '@features/admin/groups';
import { finalize, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector       : 'groups-manage',
    templateUrl    : './groups-manage.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsManageComponent
{
    groups$: Observable<GroupWithChildren[]>;
    members$: Observable<GroupMembersSimple>;
    selectedGroup$ = new Subject<GroupWithChildren>();
    loading$ = new BehaviorSubject(true);

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(private _service: GroupsManageService, private _data: GroupsDataService)
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.groups$ = _service.groups$;

        this. members$ = this.selectedGroup$
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(tap(_ => this.loading$.next(true)))
            .pipe(
                switchMap(group => {
                    return this._data.getGroupMembers$(group.id)
                        .pipe(finalize(() => this.loading$.next(false)));
                })
            );
    }

    onGroupSelected( selected: GroupWithChildren ): void {
        console.log( 'selected', selected, '' );
        this.selectedGroup$.next(selected);
    }
}