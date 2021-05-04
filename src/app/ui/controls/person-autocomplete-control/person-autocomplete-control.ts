import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { debounceTime, filter, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { PersonAutocompletes } from '@ui/layout/common/search/search-bar.models';
import { PersonSearchService } from '@ui/controls/person-autocomplete-control/person-search.service';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
    selector: 'person-autocomplete-control',
    templateUrl: './person-autocomplete-control.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PersonAutocompleteControl),
            multi: true
        }
    ]
})
export class PersonAutocompleteControl implements ControlValueAccessor, OnInit, OnDestroy
{
    @Input() debounce: number = 300;
    @Input() minLength: number = 2;
    /**
     * required
     *
     * @param {boolean} value
     */
    private _required = false;
    @Input()
    get required(): boolean
    {
        return this._required;
    }
    set required(value: boolean)
    {
        this._required = coerceBooleanProperty(value);
    }

    @Output() selectionChange = new EventEmitter<MatSelectChange>();

    /**
     * search form control
     */
    searchControl = new FormControl('');

    isSearching: boolean = false;
    results: PersonAutocompletes;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(private _search: PersonSearchService)
    {
        this._unsubscribeAll = new Subject();
    }

    /**
     * model --> view
     */
    writeValue(value: number): void {
        if (value) {
            this.searchControl.setValue(value, { emitEvent: false });
        } else {
            this.searchControl.reset('');
        }
    }

    /**
     * view --> model
     */
    registerOnChange(fn: (value: number) => void) {
        this.searchControl
            .valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fn);
    }

    /**
     * model --> view
     */
    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    onTouched: () => void = () => {};

    /**
     * On keydown of the search input
     *
     * @param event
     */
    onKeydown(event: KeyboardEvent): void
    {
        // Listen for escape to close the search
        // Escape
        if ( event.code === 'Escape' )
        {
            // Clear the search input
            this.searchControl.setValue('');
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
                switchMap(value =>  this._search.lookup(value)
                    .pipe(
                        finalize(() => this.isSearching = false)
                    )
                )
            )
            .subscribe((response: PersonAutocompletes) => {
                // Store the results
                this.results = response;
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

    selectPerson( id: string | number ): void
    {

    }
}
