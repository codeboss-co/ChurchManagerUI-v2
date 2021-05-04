import { Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { PersonAutocompletes } from '@ui/layout/common/search/search-bar.models';

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
export class PersonAutocompleteControl implements ControlValueAccessor, OnDestroy
{
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
    constructor()
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
