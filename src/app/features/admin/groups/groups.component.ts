import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'groups',
    templateUrl    : './groups.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
