import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { GroupWithChildren } from '@features/admin/groups';

@Component({
    selector       : 'group-details',
    templateUrl    : './group-details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailsComponent
{
    @Input() group: GroupWithChildren;
}