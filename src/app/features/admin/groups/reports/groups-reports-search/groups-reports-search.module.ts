import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReportDatePickerControlModule } from '@ui/controls/report-date-picker-control/report-date-picker-control.module';
import { GroupTypeGroupsSelectControlModule } from '@ui/controls/group-types-groups-select-control/group-type-groups-select-control.module';
import { GroupsReportsDataService } from '@features/admin/groups/reports/groups-reports-data.service';
import { GroupsReportsSearchComponent } from '@features/admin/groups/reports/groups-reports-search/groups-reports-search.component';

@NgModule({
    declarations: [
        GroupsReportsSearchComponent
    ],
    imports: [
        CommonModule,
        SharedModule,

        MatButtonModule,
        MatIconModule,

        // Controls
        ReportDatePickerControlModule,
        GroupTypeGroupsSelectControlModule
    ],
    providers: [GroupsReportsDataService],
    exports: [GroupsReportsSearchComponent]
})
export class GroupsReportsSearchModule
{

}