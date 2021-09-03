import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GeneralTableComponent } from '@ui/components/general-table/general-table.component';
import { PaginatedTableComponent } from '@ui/components/general-table/paginated-general-table/paginated-table.component';
import { MatMenuModule } from '@angular/material/menu';

// https://github.com/JamesDepret/angular-generic-mat-table/blob/master/src/app/app.component.html

@NgModule( {
    declarations: [GeneralTableComponent, PaginatedTableComponent],
    exports: [GeneralTableComponent, PaginatedTableComponent],
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
