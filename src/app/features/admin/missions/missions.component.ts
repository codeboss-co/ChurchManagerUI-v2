import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'missions',
    templateUrl    : './missions.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
