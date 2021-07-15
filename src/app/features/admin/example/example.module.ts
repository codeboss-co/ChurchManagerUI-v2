import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExampleComponent } from 'app/features/admin/example/example.component';
import { ReportDatePickerControlModule } from '@ui/controls/report-date-picker-control/report-date-picker-control.module';
import { MatConfirmDialogModule } from '@ui/components/mat-confirm-dialog/mat-confirm-dialog.module';
import { MatButtonModule } from '@angular/material/button';

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
        MatConfirmDialogModule
    ]
})
export class ExampleModule
{
}
