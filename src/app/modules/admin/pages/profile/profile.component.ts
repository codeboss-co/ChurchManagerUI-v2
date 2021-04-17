import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'profile',
    templateUrl    : './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
