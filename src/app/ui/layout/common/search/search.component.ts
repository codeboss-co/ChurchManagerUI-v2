import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations/public-api';
import { PersonAutocompletes } from '@ui/layout/common/search/search-bar.models';
import { Observable } from 'rxjs/internal/Observable';
import { ApiResponse } from '@shared/shared.models';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';

@Component({
    selector     : 'search',
    templateUrl  : './search.component.html',
    encapsulation: ViewEncapsulation.None,
    exportAs     : 'fuseSearch',
    animations   : fuseAnimations
})
export class SearchComponent implements OnChanges, OnInit, OnDestroy
{
    @Input() appearance: 'basic' | 'bar' = 'basic';
    @Input() debounce: number = 300;
    @Input() minLength: number = 2;
    @Output() search: EventEmitter<any> = new EventEmitter<any>();

    opened: boolean = false;
    isSearching: boolean = false;
    results: PersonAutocompletes;
    searchControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _elementRef: ElementRef,
        private _httpClient: HttpClient,
        private _renderer2: Renderer2,
        @Inject(ENV) private environment: Environment,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any
    {
        return {
            'search-appearance-bar'  : this.appearance === 'bar',
            'search-appearance-basic': this.appearance === 'basic',
            'search-opened'          : this.opened
        };
    }

    /**
     * Setter for bar search input
     *
     * @param value
     */
    @ViewChild('barSearchInput')
    set barSearchInput(value: ElementRef)
    {
        // If the value exists, it means that the search input
        // is now in the DOM and we can focus on the input..
        if ( value )
        {
            // Give Angular time to complete the change detection cycle
            setTimeout(() => {

                // Focus to the input element
                value.nativeElement.focus();
            });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void
    {
        // Appearance
        if ( 'appearance' in changes )
        {
            // To prevent any issues, close the
            // search after changing the appearance
            this.close();
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the search field value changes
        this.searchControl.valueChanges
            .pipe(
                debounceTime(this.debounce),
                takeUntil(this._unsubscribeAll),
                map((value) => {

                    // Set the search results to null if there is no value or
                    // the length of the value is smaller than the minLength
                    // so the autocomplete panel can be closed
                    if ( !value || value.length < this.minLength )
                    {
                        this.results = null;
                    }

                    // Continue
                    return value;
                }),
                filter((value) => {
                    // Filter out undefined/null/false statements and also
                    // filter out the values that are smaller than minLength
                    return value && value.length >= this.minLength;
                }),
                tap(() => this.isSearching = true),
                // use switch map so as to cancel previous subscribed events, before creating new once
                switchMap(value =>  this.lookup(value)
                    .pipe(
                        finalize(() => this.isSearching = false)
                    )
                )
            )
            .subscribe((response: PersonAutocompletes) => {
                // Store the results
                this.results = response;
                // Execute the event
                this.search.next(this.results);
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On keydown of the search input
     *
     * @param event
     */
    onKeydown(event: KeyboardEvent): void
    {
        // Listen for escape to close the search
        // if the appearance is 'bar'
        if ( this.appearance === 'bar' )
        {
            // Escape
            if ( event.code === 'Escape' )
            {
                // Close the search
                this.close();
            }
        }
    }

    /**
     * Open the search
     * Used in 'bar'
     */
    open(): void
    {
        // Return if it's already opened
        if ( this.opened )
        {
            return;
        }

        // Open the search
        this.opened = true;
    }

    /**
     * Close the search
     * * Used in 'bar'
     */
    close(): void
    {
        // Return if it's already closed
        if ( !this.opened )
        {
            return;
        }

        // Clear the search input
        this.searchControl.setValue('');

        // Close the search
        this.opened = false;
    }

    lookup(value: string): Observable<PersonAutocompletes> {
        return this.searchApi(value.toLowerCase()).pipe(
            // map the date property of the api results
            map(response => response.data.map(person => person)),
            // catch errors
            catchError(_ => {
                return of(null);
            })
        );
    }

    searchApi(query: string): Observable<ApiResponse> {
        const url = `${this.environment.baseUrls.apiUrl}/v1/people/autocomplete?searchTerm=${query}`;
        return this._httpClient.get<ApiResponse>(url);
    }
}
