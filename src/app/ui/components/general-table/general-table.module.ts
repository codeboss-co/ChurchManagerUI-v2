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
        MatInputModule,
        MatIconModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule,
        MatMenuModule,

        SharedModule
    ]
} )
export class GeneralTableModule
{
}
