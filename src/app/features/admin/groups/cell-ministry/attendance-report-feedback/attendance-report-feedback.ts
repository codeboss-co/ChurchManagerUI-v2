import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CellAttendanceReportsComponent } from '@features/admin/groups/cell-ministry/cell-attendance-reports/cell-attendance-reports.component';
import { ActivatedRoute } from '@angular/router';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { CellMinistryDataService } from '@features/admin/groups/cell-ministry/_services/cell-ministry-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { GroupAttendanceRecordDetail, GroupAttendee } from '@features/admin/groups/cell-ministry/cell-ministry.model';

@Component({
    selector       : 'attendance-report-feedback',
    templateUrl    : './attendance-report-feedback.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceReportFeedbackComponent implements OnInit
{
    attendanceRecord$: Observable<GroupAttendanceRecordDetail>;

    tableColumns: string[] = ['firstName', 'lastName', 'didAttend'];

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _cellAttendanceReportsComponent: CellAttendanceReportsComponent,
        private _data: CellMinistryDataService
    )
    {
    }

    ngOnInit(): void
    {
        // Open the drawer
        this._cellAttendanceReportsComponent.matDrawer.open();
        // Set the attendance record
        this.attendanceRecord$ = this._data.attendanceRecord$;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: GroupAttendee): any
    {
        return item.groupMemberId || index;
    }

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._cellAttendanceReportsComponent.matDrawer.close();
    }
}