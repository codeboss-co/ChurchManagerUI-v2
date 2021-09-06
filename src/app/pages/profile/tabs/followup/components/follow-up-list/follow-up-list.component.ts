import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TableBtn, TableColumn } from '@ui/components/general-table';
import { FollowUpRecord } from '../../follow-up.models';
import { parseLocalDate } from '@core/date-utils';
import { pagingServiceProvider } from './follow-up-paging.providers';

@Component({
  selector: 'profile-follow-up-list',
  templateUrl: './follow-up-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [pagingServiceProvider]
})
export class FollowUpListComponent implements OnInit {

    columns: TableColumn[];
    buttons: TableBtn[] = [];

    constructor() {
        this.columns = [
            { columnDef: 'assignedDate',     header: 'Assigned Date',    cell: (element: FollowUpRecord) => {
                    return parseLocalDate(element.assignedDate);
            } },
            { columnDef: 'actionDate',     header: 'Action Date',    cell: (element: FollowUpRecord) => {
                    return parseLocalDate(element.actionDate);
            } },
            { columnDef: 'type',     header: 'Type',     cell: (element: FollowUpRecord) => `${element.type}` },
            { columnDef: 'severity',   header: 'Severity',   cell: (element: FollowUpRecord) => `${element.severity}` },
            { columnDef: 'person',    header: 'Person',    cell: (element: FollowUpRecord) => `${element.person}` },
            { columnDef: 'assignedPerson', header: 'Assigned Person', cell: (element: FollowUpRecord) => `${element.assignedPerson}` },
            { columnDef: 'note', header: 'Note', cell: (element: FollowUpRecord) => `${element.note}` },
            { columnDef: 'requiresAdditionalFollowUp', header: 'Additional FollowUp', cell: (element: FollowUpRecord) => `${element.requiresAdditionalFollowUp}` },
        ];

        this.buttons = [
            { icon: 'note_add',    payload: (element: FollowUpRecord) => `${element.id}`, action: 'add', text: 'Add' },
            { icon: 'build',    payload: (element: FollowUpRecord) => `${element.id}`, action: 'edit', text: 'Edit' },
            { icon: 'delete',    payload: (element: FollowUpRecord) => `${element.id}`, action: 'delete', text: 'Remove' },
        ];
    }

  ngOnInit(): void {
  }

    onButtonClicked( action: string[] ) {
        console.log('button clicked: ',  action);
    }


}
