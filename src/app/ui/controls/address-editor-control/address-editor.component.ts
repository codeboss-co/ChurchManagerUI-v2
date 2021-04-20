import { Component, ElementRef, forwardRef, OnDestroy } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator,
    Validators
} from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AddressFormValue } from '@ui/controls/address-editor-control/address-editor.model';

@Component( {
    selector: 'cm-address-editor',
    templateUrl: './address-editor.component.html',
    styleUrls: ['./address-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => AddressEditorComponent ),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef( () => AddressEditorComponent ),
            multi: true
        }
    ]
} )
export class AddressEditorComponent implements ControlValueAccessor, Validator, OnDestroy {

    private readonly _destroyed$: Subject<void> = new Subject();

    public addressForm = new FormGroup( {
        street: new FormControl( null, [Validators.required] ),
        city: new FormControl( null, [Validators.required] ),
        country: new FormControl( 'South Africa', [Validators.required] ),
        province: new FormControl( null, [Validators.required] ),
        postalCode: new FormControl( null, [Validators.required] )
    } );

    constructor( private _elementRef: ElementRef ) { }

    writeValue( address: AddressFormValue ): void {
        if ( address ) {
            this.addressForm.patchValue( address );
        }
    }

    registerOnChange( fn: any ): void {
        this.addressForm.valueChanges
            .pipe(
                takeUntil( this._destroyed$ )
            )
            .subscribe( fn );
    }

    registerOnTouched( fn: any ): void {
        this._elementRef.nativeElement.querySelectorAll( '*' ).forEach(
            ( element: HTMLElement ) => {
                fromEvent( element, 'blur' )
                    .pipe(
                        takeUntil( this._destroyed$ ),
                        tap( x => fn() )
                    ).subscribe();
            }
        );
    }

    validate( control: AbstractControl ): ValidationErrors {
        return this.addressForm.valid
            ? null
            : Object.keys( this.addressForm.controls ).reduce( ( accumulatedErrors, formControlName ) => {
                const errors = { ...accumulatedErrors };

                const controlErrors = this.addressForm.controls[formControlName].errors;

                if ( controlErrors ) {
                    errors[formControlName] = controlErrors;
                }

                return errors;
            }, {} );
    }

    setDisabledState?( isDisabled: boolean ): void {
        isDisabled ? this.addressForm.disable() : this.addressForm.enable();
    }

    ngOnDestroy() {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
