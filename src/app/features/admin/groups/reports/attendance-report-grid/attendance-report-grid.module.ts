import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceReportGridComponent } from './attendance-report-grid.component';
import { WebdatarocksModule } from '@shared/webdatarocks/webdatarocks.module';
import { SharedModule } from '@shared/shared.module';
import { ReportDatePickerControlModule } from '@ui/controls/report-date-picker-control/report-date-picker-control.module';
import { GroupTypeGroupsSelectControlModule } from '@ui/controls/group-types-groups-select-control/group-type-groups-select-control.module';
import { GroupsReportsDataService } from '@features/admin/groups/reports/groups-reports-data.service';

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
        ReportDatePickerControlModule,
        GroupTypeGroupsSelectControlModule
    ],
    providers: [GroupsReportsDataService],
    exports: [AttendanceReportGridComponent]
})
export class AttendanceReportGridModule {
}
