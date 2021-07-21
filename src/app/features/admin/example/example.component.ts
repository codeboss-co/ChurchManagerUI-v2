import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent
{
    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService
    )
    {
    }

    /**
     * Open confirmation dialog
     */
    openConfirmationDialog(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Confirm Action',
            message: 'Do you want to confirm this action?',
            actions: {
                confirm: {
                    label: 'Confirm'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                console.log('The user confirmed the action');
            }
        });

    }
}
