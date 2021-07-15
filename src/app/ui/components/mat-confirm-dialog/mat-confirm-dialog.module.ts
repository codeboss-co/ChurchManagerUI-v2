import { MatConfirmDialogComponent } from '@ui/components/mat-confirm-dialog/mat-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { DialogService } from '@ui/components/mat-confirm-dialog/mat-dialog.service';

@NgModule({
    declarations: [MatConfirmDialogComponent],
    imports: [
        CommonModule,

        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatToolbarModule,
    ],
    providers: [DialogService],
    exports: [MatConfirmDialogComponent]
})
export class MatConfirmDialogModule
{
}