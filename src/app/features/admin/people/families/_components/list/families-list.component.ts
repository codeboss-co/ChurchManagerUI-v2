import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { TableBtn, TableColumn } from '@ui/components/general-table';
import { parseLocalDate } from '@core/date-utils';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Family, pagingServiceProvider } from '@features/admin/people/families';

@Component({
    selector       : 'families',
    templateUrl    : './families-list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [pagingServiceProvider]
})
export class FamiliesListComponent implements OnInit
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    drawerMode: 'over' | 'side';

    // View Variables
    groupId: number | undefined;
    viewMode: 'all' | 'group' = 'all';

    // Table definitions
    columns: TableColumn[];
    buttons: TableBtn[] = [];

    // Private
    private _unsubscribeAll = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
        this.columns = [
            { columnDef: 'name',     header: 'Name',     cell: (element: Family) => `${element.name}` },
            { columnDef: 'city',     header: 'City',     cell: (element: Family) => `${element.city}` },
            { columnDef: 'country',   header: 'Country',   cell: (element: Family) => `${element.country}` }
        ];

        this.buttons = [
            { icon: 'note_add',    payload: (element: Family) => `${element.id}`, action: 'add', text: 'Add Person' },
        // { icon: 'build',    payload: (element: Family) => `${element.id}`, action: 'edit', text: 'Edit' },
            { icon: 'delete',    payload: (element: Family) => `${element.id}`, action: 'delete', text: 'Remove' },
        ];
    }

    ngOnInit(): void
    {
        // Try extract groupId from query string (can be undefined)
        const groupIdParam$ = this._activatedRoute.queryParams
            .pipe(map(({groupId}) => groupId))
            .pipe(filter(groupId => groupId)); // skips when not present

        // Update controls based on mode
        groupIdParam$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe();

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'],
            {
                relativeTo: this._activatedRoute,
                queryParams: { groupId: this.groupId }
            });
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    onButtonClicked(action: string[])
    {
        console.log('button clicked: ',  action);

        if (action[0] === 'add') {

        }

        /**
         * Go to detail
         */
        if (action[0] === 'drawer') {
            const id =  action[1];
            console.log('drawer click', 'id', id);
            // Go to detail
            this._router.navigate(
                ['/apps/people/families/list/', id],
                { queryParams: { groupId: this.groupId } });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }
}