import { Component, OnDestroy, ViewChild } from '@angular/core';
import { WebdatarocksComponent } from '@shared/webdatarocks/webdatarocks.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { CustomValidators } from '@shared/validators/common-forms.validators';
import { Observable } from 'rxjs/internal/Observable';
import {
    GroupAttendanceReportGridQuery,
    GroupAttendanceReportGridRow
} from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { GroupsReportsDataService } from '@features/admin/groups/reports/groups-reports-data.service';

@Component({
  selector: 'groups-attendance-report-grid',
  templateUrl: './attendance-report-grid.component.html'
})
export class AttendanceReportGridComponent implements OnDestroy
{
    @ViewChild('pivot1') child: WebdatarocksComponent;

    searchForm: FormGroup;
    searchBtnClicked = new Subject();

    // Private
    private _unsubscribeAll = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _data: GroupsReportsDataService)
    {
        this.searchForm = this._formBuilder.group({
            groupTypeGroup: [null, [Validators.required, CustomValidators.groupAndGroupType]],
            reportingDate: [null, [Validators.required]]
        });

        const query$: Observable<GroupAttendanceReportGridQuery> =  this.searchBtnClicked
            .pipe(
                filter( () =>  this.searchForm.valid),
                takeUntil(this._unsubscribeAll),
                map( () => {

                    const {groupTypeGroup, reportingDate} = this.searchForm.value;

                    const {groupTypeId, groupId} = groupTypeGroup;
                    const from =  reportingDate[0];
                    const to =  reportingDate[1];

                    return {groupTypeId, groupId, from, to};
                })
            );

        const data$ = query$
            .pipe(
                switchMap((query:GroupAttendanceReportGridQuery) =>
                {
                   const {groupTypeId, groupId, from, to} = query;
                   return  this._data.getAttendanceReportGrid$(groupTypeId, groupId, from, to)
                })
            );

        data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(
                (results: GroupAttendanceReportGridRow[]) => {
                    this.child.webDataRocks.setReport({
                        dataSource: {
                            data: results,
                        },
                    });
                }
            );
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

    onPivotReady(pivot: WebDataRocks.Pivot): void {
        console.log('[ready] WebdatarocksComponent', this.child);
    }

    onCustomizeCell(
        cell: WebDataRocks.CellBuilder,
        data: WebDataRocks.CellData
    ): void {
        if (data.isClassicTotalRow) {
            cell.addClass('fm-total-classic-r');
        }
        if (data.isGrandTotalRow) {
            cell.addClass('fm-grand-total-r');
        }
        if (data.isGrandTotalColumn) {
            cell.addClass('fm-grand-total-c');
        }
    }

    onReportComplete(): void {
        this.child.webDataRocks.off('reportcomplete');
       /* this.child.webDataRocks.setReport({
            dataSource: {
                filename: 'https://cdn.webdatarocks.com/data/data.json',
            },
        });*/
    }
}
