import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { GroupAttendanceAnalyticsComponent } from '@features/admin/groups/reporting/attendance-analytics/group-attendance-analytics.component';
import { ReportTemplateResolver } from '@features/common/reports/_services/report-template.resolver';
import { GroupsReportsSearchModule } from '@features/common/reports/groups-reports-search/groups-reports-search.module';
import { AttendanceReportGridModule } from '@features/common/reports/attendance-report-grid/attendance-report-grid.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const routes: Routes = [
    /* group attendance grid / analytics */
    {
        path     : 'attendance-analytics',
        component: GroupAttendanceAnalyticsComponent,
        data: {
            report: 'group-attendance-report' // Report name we will extract template for
        },
        resolve: {
            reportTemplate: ReportTemplateResolver
        }
    }
];

@NgModule({
    declarations: [GroupAttendanceAnalyticsComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,

        MatProgressBarModule,

        // Features
        GroupsReportsSearchModule,
        AttendanceReportGridModule
    ],
    exports: [GroupAttendanceAnalyticsComponent]
})
export class GroupsReportingModule
{
}