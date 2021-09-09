import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { QueryBase } from '@shared/query-base';
import { FollowUpQuery } from '../../follow-up.models';
import { FormBuilder } from '@angular/forms';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'profile-follow-up-list-query',
  templateUrl: './follow-up-list-query.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FollowUpListQueryComponent extends QueryBase<FollowUpQuery> implements OnInit
{
    followUpTypes: string[] = ['New Convert', 'General Well Being', 'Home Visitation', 'Death'];
    severityList: string[] = ['Normal' , 'Urgent'];

    constructor(private _formBuilder: FormBuilder)
  {
      super();

      this.searchForm = this._formBuilder.group({
          types: [],
          severity: [],
          assignedToMe: [true],
          withAction: [false],
          from: [null],
          to: [null]
      });
  }

  ngOnInit(): void
  {
      this.query$  =  this.searchBtnClicked
          .pipe(
              filter( () =>  this.searchForm.valid),
              map( () => {
                  return this.searchForm.value;
              })
          );
  }

}
