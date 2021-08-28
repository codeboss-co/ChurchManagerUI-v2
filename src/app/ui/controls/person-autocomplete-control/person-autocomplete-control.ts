import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR, ValidationErrors, Validator,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { debounceTime, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PersonAutocompletes } from '@ui/layout/common/search/search-bar.models';
import { PersonSearchService } from '@ui/controls/person-autocomplete-control/person-search.service';
import { Observable } from 'rxjs/internal/Observable';
import { Identifiable } from '@shared/shared.models';
import { containsIdValidation, isAutocompleteOption } from '@shared/validators/common-forms.validators';

@Component({
    selector: 'person-autocomplete-control',
    templateUrl: './person-autocomplete-control.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PersonAutocompleteControl),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => PersonAutocompleteControl),
            multi: true
        }
    ]
})
export class PersonAutocompleteControl implements ControlValueAccessor, OnInit, OnDestroy, Validator
{
    @Input() appearance = 'outline'; // | 'standard';
    @Input() label;
    @Input() debounce: number = 300;
    @Input() minLength: number = 2;
    @Input() debug = false;

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

    private _unsubscribeAll: Subject<any> = new Subject();

    /**
     * Constructor
     */
    constructor(private _search: PersonSearchService)
    {
        this.inputControl = new FormControl(null, []);
    }

    /**
     * model --> view
     */
    writeValue(value: Identifiable): void {
        if (value) {
            this.inputControl.setValue(value, { emitEvent: false });
        } else {
            this.inputControl.reset(null);
        }
    }

    /**
     * view --> model
     */
    registerOnChange(fn: (value: Identifiable) => void): void
    {
        this.inputControl
            .valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            // This is what is returned to the formControl binding
            // We map to return only the id and the label
            .pipe(map( (value: any) => {
                // return the id and the label
                // on the parent form we can check for this and set state invalid by adding containsIdValidation
                // Example:  add-group-member-form-dialog.component.ts
                if(value && isAutocompleteOption(value)) return {id: value.id, label: value.label};
                // return the value
                return value;
            } ))
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
            this.inputControl.setValue(null);
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
                tap((value) => {
                    this._updateValueAndValidity( value );
                }),
                filter((value: string) => value && value.length >= this.minLength),
                tap((value) => {
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

    /**
     * Dynamically set validation on the control
     */
    private _updateValueAndValidity( value ) {
        let validators: ValidatorFn[] = [];
        // If there a value it must be an autocomplete value to be valid
        // this forces a dropdown selection before the form becomes valid
        if ( value ) {
            validators.push( containsIdValidation );
        } else {
            validators = [];
        }

        if ( this._required ) {
            validators.push( Validators.required );
        }

        this.inputControl.setValidators( validators );
        this.inputControl.updateValueAndValidity( { emitEvent: false } ); // emitting stopped the control from working
    }

    validate( control: AbstractControl ): ValidationErrors | null
    {
        // Special case when its not required
        // for some reason `this.inputControl.valid` wasnt working
        if (!this.required && (!this.inputControl.value || this.inputControl.value === '')) {
            return null;
        }

        return this.inputControl.valid ? null : { invalidForm: {valid: false, message: 'person autocomplete is invalid'}};
    }
}