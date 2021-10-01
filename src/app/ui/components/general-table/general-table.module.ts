import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GeneralTableComponent } from '@ui/components/general-table/general-table.component';
import { PaginatedGeneralTableComponent } from '@ui/components/general-table/paginated-general-table/paginated-general-table.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * @credit JamesDepret
 *
 * https://github.com/JamesDepret/angular-generic-mat-table/blob/master/src/app/app.component.html
 * https://stackblitz.com/edit/angular-generic-mat-table
 */

@NgModule( {
    declarations: [GeneralTableComponent, PaginatedGeneralTableComponent],
    exports: [GeneralTableComponent, PaginatedGeneralTableComponent],
    imports: [
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatIconModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        MatMenuModule,

        SharedModule
    ]
} )
export class GeneralTableModule
{
}
