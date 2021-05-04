import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { debounceTime, filter, finalize, map, switchMap, takeUntil } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { PersonAutocompletes } from '@ui/layout/common/search/search-bar.models';
import { PersonSearchService } from '@ui/controls/person-autocomplete-control/person-search.service';
import { tap } from 'rxjs/internal/operators/tap';
import { Observable } from 'rxjs/internal/Observable';
import { Identifiable } from '@shared/shared.models';
import { containsIdValidation } from '@shared/validators/common-forms.validators';

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
    inputControl: FormControl;

    /**
     * Autocomplete search results stream
     */
    searchResults$: Observable<PersonAutocompletes>;

    noResults: boolean = false;
    isSearching: boolean = false;
    results: PersonAutocompletes;

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     */
    constructor(private _search: PersonSearchService)
    {
        this._unsubscribeAll = new Subject();

        if ( this.required ) {
            this.inputControl = new FormControl('', [Validators.required, containsIdValidation]);
        } else {
            this.inputControl = new FormControl('', [containsIdValidation]);
        }
    }

    /**
     * model --> view
     */
    writeValue(value: number): void {
        if (value) {
            this.inputControl.setValue(value, { emitEvent: false });
        } else {
            this.inputControl.reset('');
        }
    }

    /**
     * view --> model
     */
    registerOnChange(fn: (value: number) => void): void
    {
        this.inputControl
            .valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fn);
    }

    /**
     * model --> view
     */
    registerOnTouched(fn: () => void): void
    {
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
            this.inputControl.setValue('');
        }
    }

    /**
     * Method linked to the mat-autocomplete `[displayWith]` input.
     * This is how result name is printed in the input box.
     */
    displayFn( result: Identifiable ): string | undefined {
        return result ? result.label : undefined;
    }


    /**
     * On init
     */
    ngOnInit(): void
    {
        /**
         * Configure fetch search results stream when search input changes
         * */
        this.searchResults$ = this.inputControl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                filter((value: string) => value && value.length >= this.minLength),
                tap(() => {
                    this.isSearching = true;
                    this.noResults = false; // reset
                }),
                debounceTime(this.debounce),
                switchMap((value: string) => this._search.lookup(value)
                    .pipe(
                        tap(results => {
                            if ( !results || !results.length ) {
                                this.noResults = true;
                            }
                        }),
                        finalize(() => this.isSearching = false)
                    )
                )
            );
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
