import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CellAttendanceReportsComponent } from '@features/admin/groups/cell-ministry/cell-attendance-reports/cell-attendance-reports.component';
import { ActivatedRoute } from '@angular/router';
import { MatDrawerToggleResult } from '@angular/material/sidenav';

@Component({
    selector       : 'attendance-report-feedback',
    templateUrl    : './attendance-report-feedback.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceReportFeedbackComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _cellAttendanceReportsComponent: CellAttendanceReportsComponent
    )
    {
    }

    ngOnInit(): void
    {
        // Open the drawer
        this._cellAttendanceReportsComponent.matDrawer.open();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._cellAttendanceReportsComponent.matDrawer.close();
    }
}