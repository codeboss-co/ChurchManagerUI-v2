import { NgModule } from '@angular/core';
import { SwUpdateComponent } from './sw-update.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [SwUpdateComponent],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        SharedModule
    ],
    exports: [SwUpdateComponent]
})
export class SwUpdateModule
{
}