import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { GroupsReportsDataService } from '@features/admin/groups/reporting/groups-reports-data.service';
import { CustomValidators } from '@shared/validators/common-forms.validators';
import { Observable } from 'rxjs/internal/Observable';
import { GroupAttendanceReportGridQuery } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { filter, map, takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'groups-reports-search',
    templateUrl: './groups-reports-search.component.html'
} )
export class GroupsReportsSearchComponent
{
    @Output() updated = new EventEmitter<GroupAttendanceReportGridQuery>();

    searchForm: FormGroup;
    searchBtnClicked = new Subject();

    // Private
    private _unsubscribeAll = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _data: GroupsReportsDataService )
    {
        this.searchForm = this._formBuilder.group( {
            groupTypeGroup: [null, [Validators.required, CustomValidators.groupAndGroupType]],
            reportingDate: [null, [Validators.required]]
        } );

        // Construct the query
        const query$: Observable<GroupAttendanceReportGridQuery> = this.searchBtnClicked
            .pipe(
                filter( () => this.searchForm.valid ),
                map( () => {
                    const { groupTypeGroup, reportingDate } = this.searchForm.value;

                    const { groupTypeId, groupId } = groupTypeGroup;
                    const from = reportingDate[0];
                    const to = reportingDate[1];

                    return { groupTypeId, groupId, from, to };
                } )
            );

        // Emit the query
        query$
            .pipe(takeUntil( this._unsubscribeAll))
            .subscribe(query => this.updated.emit(query));
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}