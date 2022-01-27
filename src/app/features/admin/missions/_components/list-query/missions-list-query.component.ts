import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { QueryBase } from '@shared/query-base';
import { FormBuilder } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { MissionsQuery, missionTypes, missionCategoryList } from '@features/admin/missions';
import { FollowUpQuery } from '../../../../../pages/profile/tabs/followup/follow-up.models';

@Component({
  selector: 'missions-list-query',
  templateUrl: './missions-list-query.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionsListQueryComponent extends QueryBase<MissionsQuery> implements OnInit, OnDestroy
{
    missionTypes = missionTypes;
    categoryList = missionCategoryList;

    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute
    )
  {
      super();

      this.searchForm = this._formBuilder.group({
          types: [],
          categories: [],
          groupId: [null],
          from: [null],
          to: [null]
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

                  const query: FollowUpQuery = cloneDeep(this.searchForm.value);

                  console.log('FollowUpQuery', query);

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
