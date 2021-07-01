import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportGridComponent } from './report-grid.component';
import { WebdatarocksModule } from '@shared/webdatarocks/webdatarocks.module';
import { SharedModule } from '@shared/shared.module';
import { ReportDatePickerControlModule } from '@ui/controls/report-date-picker-control/report-date-picker-control.module';
import { GroupTypeGroupsSelectControlModule } from '@ui/controls/group-types-groups-select-control/group-type-groups-select-control.module';
import { GroupsReportsDataService } from '@features/admin/groups/reporting/groups-reports-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    declarations: [
        ReportGridComponent
    ],
    imports: [
        CommonModule,
        SharedModule,

        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,

        // 3rd party
        WebdatarocksModule,
        // Controls
        ReportDatePickerControlModule,
        GroupTypeGroupsSelectControlModule
    ],
    providers: [GroupsReportsDataService],
    exports: [ReportGridComponent]
})
export class ReportGridModule {
}
