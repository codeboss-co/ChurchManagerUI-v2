/**
 * @title Paginated filter query example
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GroupAttendanceQuery } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { filter, map } from 'rxjs/operators';
import { QueryBase } from '@shared/query-base';

@Component( {
    selector: 'example-paginated-query',
    templateUrl: 'example-paginated-query.html',
} )
export class ExamplePaginatedQueryComponent extends QueryBase<GroupAttendanceQuery> implements OnInit
{
    constructor(private _formBuilder: FormBuilder)
    {
        super();

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
