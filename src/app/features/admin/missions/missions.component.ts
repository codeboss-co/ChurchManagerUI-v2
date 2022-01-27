import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MissionsCreateDialogComponent } from '@features/admin/missions/_components/create/missions-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormActions } from '@shared/shared.models';

@Component({
    selector       : 'missions',
    templateUrl    : './missions.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionsComponent
{
    dialogRef: any;


    /**
     * Constructor
     */
    constructor(private _matDialog: MatDialog)
    {
    }

    createMission()
    {
        this.dialogRef = this._matDialog.open(MissionsCreateDialogComponent, {
            panelClass: 'missions-create-dialog',
            data      : {
                action: FormActions.New,
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response) => {
                if ( !response )
                {
                    return;
                }

                // Do something here
            });
    }
}
