/**
 * @title Paginated filter query example
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { GroupAttendanceQuery } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { filter, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component( {
    selector: 'example-paginated-query',
    templateUrl: 'example-paginated-query.html',
} )
export class ExamplePaginatedQueryComponent implements OnInit {

    searchForm: FormGroup;
    searchBtnClicked = new Subject();

    query$: Observable<GroupAttendanceQuery>;

    constructor(
        private _formBuilder: FormBuilder
    ) {
        this.searchForm = this._formBuilder.group({
            churchGroup: [null, [Validators.required]],
            withFeedBack: [false],
            from: [null],
            to: [null]
        });
    }

    ngOnInit(): void {
        this.query$  =  this.searchBtnClicked
            .pipe(
                filter( () =>  this.searchForm.valid),
                map( () => {

                    const {churchGroup, withFeedBack, from, to} = this.searchForm.value;

                    const {churchId, groupId} = churchGroup;

                    return {churchId, groupId, withFeedBack, from, to};
                })
            );
    }

}
