import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExampleComponent } from 'app/features/admin/example/example.component';
import { ReportDatePickerControlModule } from '@ui/controls/report-date-picker-control/report-date-picker-control.module';
import { MatButtonModule } from '@angular/material/button';
import { GeneralTableModule } from '@ui/components/general-table/general-table.module';
import { pagingServiceProvider } from './mock/providers/example-paging.providers';
import { PersonAutocompleteControlModule } from '@ui/controls/person-autocomplete-control/person-autocomplete-control.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: ExampleComponent
    }
];


@NgModule({
    declarations: [
        ExampleComponent
    ],
    imports     : [
        RouterModule.forChild(exampleRoutes),

        MatButtonModule,

        // Controls
        ReportDatePickerControlModule,
        GeneralTableModule,
        PersonAutocompleteControlModule
    ],
    providers : [
        pagingServiceProvider
    ]
})
export class ExampleModule
{
}


