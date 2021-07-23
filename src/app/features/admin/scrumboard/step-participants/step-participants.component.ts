import { Component, OnInit } from '@angular/core';
import { ScrumboardService } from '@features/admin/scrumboard/scrumboard.service';
import { Observable } from 'rxjs';
import { DiscipleshipStep } from '@features/admin/discipleship/discipleship.models';

@Component({
  selector: 'scrumboard-step-participants',
  templateUrl: './step-participants.component.html',
  styleUrls: ['./step-participants.component.scss']
})
export class ScrumboardStepParticipantsComponent implements OnInit {

    public participants$:  Observable<DiscipleshipStep[]>;

  constructor(private _scrumboardService: ScrumboardService) { }

  ngOnInit(): void {
      this.participants$ = this._scrumboardService.cards$;
  }

}
