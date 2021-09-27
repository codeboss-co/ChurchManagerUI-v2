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
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CellMinistryDataService } from '../_services/cell-ministry-data.service';
import { GroupAttendanceQuery, GroupAttendanceRecord } from '../cell-ministry.model';
import { PaginatedDataSource } from '@shared/data/paginated.data-source';
import { Sort } from '@shared/data/pagination.models';
import { Observable } from 'rxjs/internal/Observable';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseConfirmationService } from '@fuse/services/confirmation';

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

    // View Variables
    groupId: number | undefined;
    viewMode: 'all' | 'group' = 'all';

    displayedColumns: string[] = ['attendanceDate', 'groupName', 'didNotOccur', 'attendanceCount',
        'firstTimerCount', 'newConvertCount', 'receivedHolySpiritCount', 'hasNotes', 'hasPhotos', 'actions'
    ];
    dataSource: PaginatedDataSource<GroupAttendanceRecord, GroupAttendanceQuery> | null;


    // Private
    private _unsubscribeAll = new Subject();
    private _deleteAttendanceRecordTrigger = new Subject<GroupAttendanceRecord>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _data: CellMinistryDataService,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfirmationService: FuseConfirmationService
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
        // Try extract groupId from query string (can be undefined)
        const groupIdParam$ = this._activatedRoute.queryParams
            .pipe(map(({groupId}) => groupId))
            .pipe(filter(groupId => groupId)); // skips when not present

        // Update controls based on mode
        groupIdParam$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((groupId) => {
                this.viewMode = 'group';
                this.groupId = groupId;
                const control = this.searchForm.get('churchGroup');
                control.setValidators([]);
                control.updateValueAndValidity();
                // Hide these columns
                this.displayedColumns = this.displayedColumns
                    .filter(x =>
                        x !== 'groupName' &&
                        x !== 'hasNotes' &&
                        x !== 'hasPhotos');
            });

        const query$: Observable<GroupAttendanceQuery> =  this.searchBtnClicked
            .pipe(
                filter( () =>  this.searchForm.valid),
                takeUntil(this._unsubscribeAll),
                map( (_) => {

                    const {churchGroup, withFeedBack, from, to} = this.searchForm.value;

                    if (this.viewMode === 'all') {
                        const {churchId, groupId} = churchGroup;
                        return {churchId, groupId, withFeedBack, from, to};
                    }

                    if (this.viewMode === 'group') {
                        return {churchId: null, groupId: this.groupId, withFeedBack, from, to};
                    }

                    console.error('CodeBoss: Error processing query$', this.searchForm.value, 'groupId:', this.groupId);
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

        this._deleteAttendanceRecordTrigger
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                switchMap(record => this._data.deleteAttendanceRecord$(record.id))
            )
            .subscribe(_ => this.searchBtnClicked.next());
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
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

    delete(record: GroupAttendanceRecord ) {
        const confirmation = this._fuseConfirmationService.delete();

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                console.log('delete confirmed');
                this._deleteAttendanceRecordTrigger.next(record);
            }
        });
    }
}