import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceReportGridComponent } from './attendance-report-grid.component';
import { WebdatarocksComponent } from '@shared/webdatarocks.component';

@NgModule({
    declarations: [
        AttendanceReportGridComponent,
        WebdatarocksComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [AttendanceReportGridComponent, WebdatarocksComponent]
})
export class AttendanceReportGridModule {
}
