import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MissionsCreateDialogComponent } from '@features/admin/missions/_components/create/missions-create-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormActions } from '@shared/shared.models';
import { first, switchMap } from 'rxjs/operators';
import { MissionsDataService } from '@features/admin/missions/_services/missions-data.service';
import { EMPTY } from 'rxjs';

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
    constructor(
        private _matDialog: MatDialog,
        private _data: MissionsDataService)
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
            .pipe(first())
            .pipe(switchMap((response) => {
                if (!response){
                    return EMPTY;
                }

                return this._data.createMission(response);
            }))
            .subscribe();
    }
}
