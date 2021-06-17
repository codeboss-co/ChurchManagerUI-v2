import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@shared/shared.module';
import { ReportDatePickerControlComponent } from './report-date-picker-control';
import { MatIconModule } from '@angular/material/icon';

const COMPONENTS = [
    ReportDatePickerControlComponent
];

@NgModule({
    declarations: [COMPONENTS],
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,

        SharedModule
    ],
    exports: [COMPONENTS],
})
export class ReportDatePickerControlModule
{
}
