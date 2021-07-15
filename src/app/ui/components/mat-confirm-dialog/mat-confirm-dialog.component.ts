import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogModel } from '@ui/components/mat-confirm-dialog/mat-confirm-dialog.model';

@Component({
    selector: 'cm-confirm-dialog',
    templateUrl: './mat-confirm-dialog.component.html',
})
export class MatConfirmDialogComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel)
    {
    }

    ngOnInit(): void
    {
    }
}
