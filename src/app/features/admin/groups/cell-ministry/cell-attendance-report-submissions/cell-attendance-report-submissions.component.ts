import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { CellMinistryDataService } from '@features/admin/groups/cell-ministry/_services/cell-ministry-data.service';
import { TableColumn } from '@ui/components/general-table';
import { AttendanceReportSubmission } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { indicate } from '@shared/data/paginated.data-source';

@Component({
    selector     : 'cell-attendance-report-submissions',
    templateUrl  : './cell-attendance-report-submissions.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations   : fuseAnimations
})
export class CellAttendanceReportSubmissionsComponent implements OnInit, OnDestroy
{
    searchForm: FormGroup;
    searchBtnClicked = new Subject();

    // View data
    attendanceReportSubmissions$ = this._data.attendanceReportSubmissions$;
    loading$ = new Subject<boolean>();
    columns: TableColumn[];

    // Private
    private _unsubscribeAll = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _data: CellMinistryDataService
    ){
        this.searchForm = this._formBuilder.group({
            church: [null, [Validators.required]],
            period: [null, [Validators.required]]
        });

        this.columns = [
            // { columnDef: 'id',    header: 'Id',    cell: (element: AttendanceReportSubmission) => `${element.id}` },
            { columnDef: 'name',     header: 'Name',     cell: (element: AttendanceReportSubmission) => `${element.name}` }
        ];
    }

    ngOnInit(): void
    {
        const query$ = this.searchBtnClicked
            .pipe(
                filter( () =>  this.searchForm.valid),
                takeUntil(this._unsubscribeAll),
                map( (_) => {

                    const {church, period} = this.searchForm.value;
                    console.log({church, period});
                    return {church, period};
                })
            );

        const fetchDataOnQueryChange$ = query$
            .pipe(
                switchMap(query => this._data.getAttendanceReportSubmissions$(query.church, query.period)
                    .pipe(indicate(this.loading$))
                )
            );

        fetchDataOnQueryChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
