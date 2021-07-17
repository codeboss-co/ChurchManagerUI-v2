import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { DialogService } from '@ui/components/mat-confirm-dialog/mat-dialog.service';

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
    constructor(private _dialog: DialogService)
    {
    }

    confirmCancelDialog() {
        this._dialog
            .confirmDialog$(
                {
                title: 'Confirm Action',
                message: 'Do you want to confirm this action?',
                confirmCaption: 'Confirm',
                cancelCaption: 'Cancel',
            })
            .subscribe((confirmed) => {
                if (confirmed) {
                    console.log('The user confirmed the action');
                }
            });
    }
}
