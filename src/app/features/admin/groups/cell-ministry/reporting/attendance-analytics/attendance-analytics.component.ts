import { Component, OnInit } from '@angular/core';
import { GroupsReportsDataService } from '@features/admin/groups/reports/groups-reports-data.service';

@Component({
  selector: 'cell-ministry-attendance-analytics',
  templateUrl: './attendance-analytics.component.html',
})
export class AttendanceAnalyticsComponent implements OnInit {

  constructor(private _data: GroupsReportsDataService) { }

  ngOnInit(): void {
  }

}
