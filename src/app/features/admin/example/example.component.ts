import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TableBtn, TableColumn } from '@ui/components/general-table';
import { UserData } from '@features/admin/example/mock/interfaces/user-data';
import { createNewUserData } from '@features/admin/example/mock/functions/mock-data';

@Component({
    selector     : 'example',
    templateUrl  : './example.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent
{
    introText = 'Button actions and payloads come here in textual form';
    columns: TableColumn[];   // this will define what you pass over to the table
    buttons: TableBtn[] = [];      // this will define what you pass over to the table
    data: UserData[];         // this is example data but you can use any object to pass to the table
    totalVolume: number = 0;  // this is an example field used to show how you can access filtered data from the table
    totalRides: number = 0;
    footer: string = '';      // in this example I'm using a dynamic footer which changes with the filtered data

    /**
     * Constructor
     */
    constructor(
        private _fuseConfirmationService: FuseConfirmationService
    )
    {
        // Create 100 userdata objects
        this.data = Array.from({length: 100}, (_, k) => createNewUserData(k + 1));

        // build the colums; columnDef: attribute name; header: column title; cell: row text
        // note that the cell attribute is the same as the columnDef attribute
        this.columns = [
            { columnDef: 'date',     header: 'Datum',    cell: (element: UserData) => `${element.date.toLocaleDateString()}` },
            { columnDef: 'name',     header: 'Name',     cell: (element: UserData) => `${element.name}` },
            { columnDef: 'volume',   header: 'Volume',   cell: (element: UserData) => `${element.volume} m³` },
            { columnDef: 'rides',    header: 'Trips',    cell: (element: UserData) => `${element.rides}` },
            { columnDef: 'material', header: 'Material', cell: (element: UserData) => `${element.material}` },
        ];
    }

    /**
     * Open confirmation dialog
     */
    openConfirmationDialog(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Confirm Action',
            message: 'Do you want to confirm this action?',
            actions: {
                confirm: {
                    label: 'Confirm'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                console.log('The user confirmed the action');
            }
        });

    }
}
