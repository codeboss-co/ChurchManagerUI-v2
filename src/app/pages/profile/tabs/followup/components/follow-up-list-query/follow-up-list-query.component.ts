import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { QueryBase } from '@shared/query-base';
import { FollowUpQuery } from '../../follow-up.models';
import { FormBuilder } from '@angular/forms';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'profile-follow-up-list-query',
  templateUrl: './follow-up-list-query.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FollowUpListQueryComponent extends QueryBase<FollowUpQuery> implements OnInit, OnDestroy
{
    followUpTypes: string[] = ['New Convert', 'General Well Being', 'Home Visitation', 'Death'];
    severityList: string[] = ['Normal' , 'Urgent'];

    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute
    )
  {
      super();

      this.searchForm = this._formBuilder.group({
          types: [],
          severity: [],
          assignedToMe: [false],
          withAction: [false],
          person: [null],
          assignedPerson: [null],
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
      // Extract PersonId from parent URL
      // https://ultimatecourses.com/blog/angular-parent-routing-params
      const personId$: Observable<string> = this._route.parent.params
          .pipe(map(({personId})  => personId));

      this.query$  =  this.searchBtnClicked
          .pipe(withLatestFrom(personId$))
          .pipe(
              filter( () =>  this.searchForm.valid),
              map( ([_, personId]) => {

                  const query: FollowUpQuery = cloneDeep(this.searchForm.value);

                  if (personId) {
                      query.person = {id: +personId};
                      console.log('personId', query);
                  }

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
