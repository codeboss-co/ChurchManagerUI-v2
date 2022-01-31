import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { QueryBase } from '@shared/query-base';
import { FormBuilder } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { MissionsQuery, missionTypes, missionCategoryList, missionStreams } from '@features/admin/missions';

@Component({
  selector: 'missions-list-query',
  templateUrl: './missions-list-query.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissionsListQueryComponent extends QueryBase<MissionsQuery> implements OnInit, OnDestroy
{
    missionTypes = missionTypes;
    categoryList = missionCategoryList;
    missionStreams = missionStreams;

    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute
    )
  {
      super();

      this.searchForm = this._formBuilder.group({
          types: [],
          categories: [],
          streams: [],
          churchGroup: [null],
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

                  const query = cloneDeep(this.searchForm.value);

                  const {types, categories, streams, churchGroup, from, to} = query;

                  console.log('MissionsQuery', query);

                  return {
                      types,
                      categories,
                      streams,
                      groupId: churchGroup?.groupId,
                      from,
                      to
                  };
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
