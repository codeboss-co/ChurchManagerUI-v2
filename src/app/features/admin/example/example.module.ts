import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExampleComponent } from 'app/features/admin/example/example.component';
import { ReportDatePickerControlModule } from '@ui/controls/report-date-picker-control/report-date-picker-control.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGoogleMapsAutocompleteModule } from '@ui/controls/ google-maps-autocomplete-control/mat-google-maps-autocomplete.module';

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
        FormsModule,
        ReactiveFormsModule,

        MatFormFieldModule,
        MatInputModule,

        // Controls
        ReportDatePickerControlModule,
        MatGoogleMapsAutocompleteModule
    ]
})
export class ExampleModule
{
}
