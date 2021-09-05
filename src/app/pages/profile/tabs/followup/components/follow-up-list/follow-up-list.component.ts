import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'profile-follow-up-list',
  templateUrl: './follow-up-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FollowUpListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
