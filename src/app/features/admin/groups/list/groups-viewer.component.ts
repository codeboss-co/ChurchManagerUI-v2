import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';

@Component({
    selector       : 'groups-viewer',
    templateUrl    : './groups-viewer.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsViewerComponent
{
    constructor(private _service: GroupsManageService)
    {
    }
}