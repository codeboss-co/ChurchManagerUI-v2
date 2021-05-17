import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { merge, Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { CellMinistryDataService } from '../_services/cell-ministry-data.service';
import { GroupAttendanceQuery, GroupAttendanceRecord } from '../cell-ministry.model';
import { PaginatedDataSource } from '@shared/data/paginated.data-source';
import { Sort } from '@shared/data/pagination.models';
import { Observable } from 'rxjs/internal/Observable';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector     : 'cell-ministry-attendance-reports',
    templateUrl  : './cell-attendance-reports.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations   : fuseAnimations
})
export class CellAttendanceReportsComponent implements OnInit
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;


    searchForm: FormGroup;
    searchBtnClicked = new Subject();
    drawerMode: 'over' | 'side';

    displayedColumns: string[] = ['attendanceDate', 'groupName', 'didNotOccur', 'attendanceCount',
        'firstTimerCount', 'newConvertCount', 'receivedHolySpiritCount', 'hasNotes', 'hasPhotos'
    ];
    dataSource: PaginatedDataSource<GroupAttendanceRecord, GroupAttendanceQuery> | null;

    // Private
    private _unsubscribeAll = new Subject();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _data: CellMinistryDataService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
        this.searchForm = this._formBuilder.group({
            churchGroup: [null, [Validators.required]],
            withFeedBack: [false],
            from: [null],
            to: [null]
        });
    }

    ngOnInit(): void {

        const query$: Observable<GroupAttendanceQuery> =  this.searchBtnClicked
            .pipe(
                filter( () =>  this.searchForm.valid),
                takeUntil(this._unsubscribeAll),
                map( () => {

                    const {churchGroup, withFeedBack, from, to} = this.searchForm.value;

                    const {churchId, groupId} = churchGroup;

                    return {churchId, groupId, withFeedBack, from, to};
                })
            );

        const initDatasource$ = query$
            .pipe(
                filter(() => !this.dataSource),
                tap(initialQuery => {
                        const initialSort: Sort<GroupAttendanceRecord> = {property: 'attendanceDate', order: 'desc'};

                        this.dataSource =  new PaginatedDataSource<GroupAttendanceRecord, GroupAttendanceQuery>(
                            (request, query) => this._data.pageCellAttendanceReports$(request, query),
                            initialSort,
                            initialQuery,
                        );
                    }
                )
            );

        const afterInitDatasource$ = query$
            .pipe(
                filter(() => !!this.dataSource),
                tap(query =>  this.dataSource.queryBy(query))
            );

        merge(initDatasource$, afterInitDatasource$).subscribe();

        /*this.searchBtnClicked
            .pipe(
                filter( () =>  this.searchForm.valid),
                takeUntil(this._unsubscribeAll),
                tap( () => {

                    const churchGroup = this.searchForm.get('churchGroup').value as ChurchGroup;
                    const withFeedBack = this.searchForm.get('withFeedBack').value;
                    const from = this.searchForm.get('from').value;
                    const to = this.searchForm.get('to').value;

                    const {churchId, groupId} = churchGroup;

                    // Initialize Paginated Data Source
                    if ( !this.dataSource ) {
                        const initialSort: Sort<GroupAttendanceRecord> = {property: 'attendanceDate', order: 'desc'};
                        const initialQuery: GroupAttendanceQuery = {churchId, groupId, withFeedBack, from, to};

                        this.dataSource =  new PaginatedDataSource<GroupAttendanceRecord, GroupAttendanceQuery>(
                            (request, query) => this._data.pageCellAttendanceReports$(request, query),
                            initialSort,
                            initialQuery,
                        );
                    } else {
                        this.dataSource.queryBy({churchId, groupId, withFeedBack, from, to});
                    }
                })
            )
            .subscribe();*/

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
        // Get the current activated route
        let route = this._activatedRoute;
        while ( route.firstChild )
        {
            route = route.firstChild;
        }
        // Go to contact
        this._router.navigate(['../'], {relativeTo: route});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Go to attendance record
     *
     * @param id
     */
    goToRecord( id: number ): void {
        console.log( 'id', id, '' );
        // Go to contact
        this._router.navigate(['/apps/groups/cell-ministry/attendance-reports/', id]);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
}