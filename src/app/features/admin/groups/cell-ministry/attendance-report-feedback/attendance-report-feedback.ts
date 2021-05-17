import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CellAttendanceReportsComponent } from '@features/admin/groups/cell-ministry/cell-attendance-reports/cell-attendance-reports.component';
import { ActivatedRoute } from '@angular/router';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { CellMinistryDataService } from '@features/admin/groups/cell-ministry/_services/cell-ministry-data.service';
import { Observable } from 'rxjs/internal/Observable';
import { GroupAttendanceRecordDetail, GroupAttendee } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { combineLatest, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
    selector       : 'attendance-report-feedback',
    templateUrl    : './attendance-report-feedback.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceReportFeedbackComponent implements OnInit
{
    attendanceRecord$: Observable<GroupAttendanceRecordDetail>;

    tableColumns: string[] = ['firstName', 'lastName', 'didAttend', 'isFirstTime', 'isNewConvert', 'receivedHolySpirit'];

    feedbackControl: FormControl = new FormControl();

    submitBtnClicked = new Subject();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        public component: CellAttendanceReportsComponent,
        private _data: CellMinistryDataService
    )
    {
    }

    ngOnInit(): void
    {
        // Open the drawer
        this.component.matDrawer.open();

        // Set the attendance record
        this.attendanceRecord$ = this._data.attendanceRecord$
            .pipe(
                tap(({attendanceReview}) => this.feedbackControl.patchValue(attendanceReview?.feedback) )
            );

        // Update attendance record
        combineLatest([this.submitBtnClicked, this._activatedRoute.params])
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                switchMap(([_, { id }]) => {
                    return this._data.updateAttendanceFeedback$(id, this.feedbackControl.value);
                } )
            ).subscribe();
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
        return this.component.matDrawer.close();
    }

    /**
     * Trigger update of attendance
     */
    updateAttendance(): void
    {
        this.submitBtnClicked.next();
    }
}