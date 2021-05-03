import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { Observable, Subject } from 'rxjs';
import { GroupWithChildren } from '@features/admin/groups';

@Component({
    selector       : 'groups-manage',
    templateUrl    : './groups-manage.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsManageComponent
{
    groups$: Observable<GroupWithChildren[]>;
    selectedGroup$ = new Subject<GroupWithChildren>();

    constructor(private _service: GroupsManageService)
    {
        this.groups$ = _service.groups$;
    }

    onGroupSelected( selected: GroupWithChildren ): void {
        console.log( 'selected', selected, '' );
        this.selectedGroup$.next(selected);
    }
}