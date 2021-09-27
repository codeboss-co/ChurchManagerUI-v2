import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PaginatedDataSource } from '@shared/data/paginated.data-source';
import { Sort } from '@shared/data/pagination.models';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Group, GroupAttendanceForm, GroupsDataService } from '@features/admin/groups';
import { GroupAttendanceFormDialogComponent } from './components/group-attendance-form/group-attendance-form-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../_services/profile.service';
import { fuseAnimations } from '@fuse/animations';

export interface GroupsQuery {
    search: string;
    personId?: number;
}

@Component({
    selector     : 'profile-groups',
    templateUrl  : './groups.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ProfileGroupsComponent implements OnInit, OnDestroy
{
    dataSource: PaginatedDataSource<Group, GroupsQuery> | null;
    displayedColumns = ['name', 'description', 'membersCount', 'buttons'];

    dialogRef: any;

    searchInput: FormControl;

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;
    private _personId: number;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     * @param {GroupsDataService} _groupData
     * @param {MatDialog} _matDialog
     * @param _route
     */
    constructor(
        private _profileService: ProfileService,
        private _groupData: GroupsDataService,
        private _matDialog: MatDialog,
        private _route: ActivatedRoute
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Extract PersonId from parent URL
        // https://ultimatecourses.com/blog/angular-parent-routing-params
        this._route.parent.params
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(tap(({personId})  => this._personId = personId ))
            .subscribe();

        // Initialize Paginated Data Source
        const initialSort: Sort<any> = {property: 'Name', order: 'asc'};
        const initialQuery: GroupsQuery = {search: '', personId: this._personId};

        this.dataSource =  new PaginatedDataSource<Group, GroupsQuery>(
            (request, query) => this._profileService.pageGroups(request, query),
            initialSort,
            initialQuery,
        );
        // Initialize Paginated Data Source

        // Respond to search changes
        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this.dataSource.queryBy({search: searchText, personId: this._personId});
            });
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

    delete( item: any ): void
    {

    }

    takeAttendance( group: Group ): void
    {
        this.dialogRef = this._matDialog.open(GroupAttendanceFormDialogComponent, {
            panelClass: 'group-attendance-form-dialog',
            data      : {
                group
            }
        });

        this.dialogRef.afterClosed()
            .pipe(
                filter(response => !!response),
                switchMap((response: GroupAttendanceForm) => {
                    console.log('takeAttendance response', response);
                    return this._groupData.registerAttendance$(response);
                })
            )
            .subscribe();
    }
}

