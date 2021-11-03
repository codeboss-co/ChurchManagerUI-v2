import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { pagingServiceProvider } from '@features/admin/missions/_components/list/missions-list-paging.providers';
import { TableBtn, TableColumn } from '@ui/components/general-table';
import { parseLocalDate } from '@core/date-utils';
import { Mission } from '@features/admin/missions';

@Component({
    selector       : 'missions',
    templateUrl    : './missions-list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [pagingServiceProvider]
})
export class MissionsListComponent implements OnInit
{
    columns: TableColumn[];
    buttons: TableBtn[] = [];

    constructor()
    {
        this.columns = [
            { columnDef: 'startDateTime',     header: 'Assigned Date',    cell: (element: Mission) => {
                    return parseLocalDate(element.startDateTime);
                } },
            { columnDef: 'type',     header: 'Type',     cell: (element: Mission) => `${element.type}` },
            { columnDef: 'category',   header: 'Category',   cell: (element: Mission) => `${element.category}` }
        ];

        this.buttons = [
            { icon: 'note_add',    payload: (element: Mission) => `${element.id}`, action: 'add', text: 'Add' },
            { icon: 'build',    payload: (element: Mission) => `${element.id}`, action: 'edit', text: 'Edit' },
            { icon: 'delete',    payload: (element: Mission) => `${element.id}`, action: 'delete', text: 'Remove' },
        ];
    }

    ngOnInit(): void
    {
    }

    onButtonClicked(action: string[])
    {
        console.log('button clicked: ',  action);

        if (action[0] === 'add') {

        }
    }
}