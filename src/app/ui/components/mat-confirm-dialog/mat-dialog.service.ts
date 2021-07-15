import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogModel } from '@ui/components/mat-confirm-dialog/mat-confirm-dialog.model';
import { MatConfirmDialogComponent } from '@ui/components/mat-confirm-dialog/mat-confirm-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    constructor(private _dialog: MatDialog) {}

    confirmDialog$(data: ConfirmDialogModel): Observable<boolean> {
        return this._dialog
            .open(MatConfirmDialogComponent, {
                data,
                width: '400px',
                disableClose: true,
            })
            .afterClosed();
    }
}