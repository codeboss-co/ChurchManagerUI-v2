import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { QueryBase } from '@shared/query-base';
import { FormBuilder } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { FamiliesQuery } from '@features/admin/people/families';

@Component({
  selector: 'families-list-query',
  templateUrl: './families-list-query.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamiliesListQueryComponent extends QueryBase<FamiliesQuery> implements OnInit, OnDestroy
{
    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute
    )
  {
      super();

      this.searchForm = this._formBuilder.group({
          name: [],
          address: []
      });
  }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
  ngOnInit(): void
  {
      this.query$  =  this.searchBtnClicked
          .pipe(
              filter( () =>  this.searchForm.valid),
              map( (_) => {

                  const query: FamiliesQuery = cloneDeep(this.searchForm.value);

                  console.log('FamiliesQuery', query);

                  return query;
              })
          );
  }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

}
