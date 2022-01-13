import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'families-home',
    templateUrl    : './families.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamiliesHomeComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
