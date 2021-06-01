import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ContactsService } from '../_services/contacts.service';
import { PaginatedDataSource } from '@shared/data/paginated.data-source';
import { PeopleAdvancedSearchQuery, PeopleSearchQuery, Person } from '@features/admin/people';
import { Sort } from '@shared/data/pagination.models';
import { PeopleDataService } from '@features/admin/people/_services/people-data.service';
import { Country } from '@features/admin/people/contacts.types';

@Component({
    selector       : 'contacts-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild('drawer') private _drawer: MatDrawer;

    countries: Country[];
    drawerMode: 'side' | 'over';
    drawerOpened: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedContact: Person;
    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _searchQuery$ = new Subject<PeopleAdvancedSearchQuery>();

    dataSource: PaginatedDataSource<Person, PeopleAdvancedSearchQuery> | null;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        private _data: PeopleDataService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Get the contact
        this._data.person$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Person) => {

                // Update the selected contact
                this.selectedContact = contact;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the countries
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((countries: Country[]) => {

                // Update the countries
                this.countries = countries;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                distinctUntilChanged(),
                debounceTime(300)
            )
            .subscribe(searchTerm => {
                this.dataSource.queryBy({searchTerm});
            });

        // Subscribe to advanced search changes
        this._searchQuery$
            .pipe( takeUntil(this._unsubscribeAll))
            .subscribe(query => {
                this.dataSource.queryBy(query);
            });

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected contact when drawer closed
                this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

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

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>((event) => {
                    return (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                        && (event.key === '/'); // '/'
                })
            )
            .subscribe(() => {
                this.createContact();
            });


        // Initialize Paginated Data Source
        const initialSort: Sort<any> = {property: 'FullName.LastName', order: 'asc'};
        const initialQuery: PeopleSearchQuery = {searchTerm: ''};

        this.dataSource =  new PaginatedDataSource<Person, PeopleAdvancedSearchQuery>(
            (request, query) => this._data.pagePeople$(request, query),
            initialSort,
            initialQuery,
        );
        // Initialize Paginated Data Source
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


    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create contact
     */
    createContact(): void
    {
        // Create the contact
        this._router.navigate(['/apps/people/new-family']);
    }

    /**
     * Get country code
     *
     * @param iso
     */
    getCountryCode(iso: string): string
    {
        if ( !iso )
        {
            return '';
        }

        return this.countries.find((country) => country.iso === iso).code;
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: Person): any
    {
        return item.personId || index;
    }

    /**
     * Toggle Drawer
     */
    toggleDrawer(): void
    {
        // Toggle the drawer
        this._drawer.toggle();
    }

    onSearchChanged( query: PeopleAdvancedSearchQuery )
    {
        console.log(query);
        this._searchQuery$.next(query);
    }
}
