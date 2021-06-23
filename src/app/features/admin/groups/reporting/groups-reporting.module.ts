import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { GroupAttendanceAnalyticsComponent } from '@features/admin/groups/reporting/attendance-analytics/group-attendance-analytics.component';
import { ReportTemplateResolver } from '@features/common/reports/_services/report-template.resolver';
import { GroupsReportsSearchModule } from '@features/admin/groups/_ui/groups-reports-search/groups-reports-search.module';
import { ReportGridModule } from '@features/common/reports/report-grid/report-grid.module';

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

        // Features
        GroupsReportsSearchModule,
        ReportGridModule
    ],
    exports: [GroupAttendanceAnalyticsComponent]
})
export class GroupsReportingModule
{
}