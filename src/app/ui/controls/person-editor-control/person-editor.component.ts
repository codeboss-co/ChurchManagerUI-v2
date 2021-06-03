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
import { PersonFormValue } from '@ui/controls/person-editor-control/person-editor.model';
import {
    PersonValidationService
} from '@ui/controls/person-editor-control/duplicate-person.validator';

@Component( {
    selector: 'cm-person-editor',
    templateUrl: './person-editor.component.html',
    styleUrls: ['./person-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => PersonEditorComponent ),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef( () => PersonEditorComponent ),
            multi: true
        }
    ]
} )
export class PersonEditorComponent implements ControlValueAccessor, Validator, OnDestroy
{
    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _phoneNumberPattern = '^((?:\\+27|27)|0)([0-9]{2})(\\d{7})$';

    public form = new FormGroup( {
        firstName: new FormControl( null, [Validators.minLength(3), Validators.required] ),
        middleName: new FormControl( null ),
        lastName: new FormControl( null, [Validators.minLength(3), Validators.required] ),
        gender: new FormControl( null ),
        ageClassification: new FormControl( null, [Validators.required] ),
        occupation: new FormControl( null ),
        emailAddress: new FormControl( null, [Validators.email] ),
        phoneNumber: new FormControl( null, [Validators.required, Validators.pattern(this._phoneNumberPattern)] ),
        birthDate: new FormControl( null ),
        receivedHolySpirit: new FormControl( false )
    }, { asyncValidators: this._validation.duplicatePerson() }
    );

    constructor(
        private _elementRef: ElementRef,
        private _validation: PersonValidationService) { }

    writeValue( person: PersonFormValue ): void
    {
        if ( person ) {
            this.form.patchValue( person );
        }
    }

    registerOnChange( fn: any ): void
    {
        this.form.valueChanges
            .pipe(takeUntil( this._destroyed$))
            .subscribe( fn );
    }

    registerOnTouched( fn: any ): void
    {
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

    validate( control: AbstractControl ): ValidationErrors
    {
        return this.form.valid
            ? null
            : Object.keys( this.form.controls ).reduce( ( accumulatedErrors, formControlName ) => {
                const errors = { ...accumulatedErrors };

                const controlErrors = this.form.controls[formControlName].errors;

                if ( controlErrors ) {
                    errors[formControlName] = controlErrors;
                }

                return errors;
            }, {} );
    }

    setDisabledState?( isDisabled: boolean ): void
    {
        isDisabled ? this.form.disable() : this.form.enable();
    }

    ngOnDestroy()
    {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
