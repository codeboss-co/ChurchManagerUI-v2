import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceReportGridComponent } from './attendance-report-grid.component';
import { WebdatarocksModule } from '@shared/webdatarocks/webdatarocks.module';
import { SharedModule } from '@shared/shared.module';
import { ReportDatePickerControlModule } from '@ui/controls/report-date-picker-control/report-date-picker-control.module';

@NgModule({
    declarations: [
        AttendanceReportGridComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        // 3rd party
        WebdatarocksModule,
        // Controls
        ReportDatePickerControlModule
    ],
    exports: [AttendanceReportGridComponent]
})
export class AttendanceReportGridModule {
}
