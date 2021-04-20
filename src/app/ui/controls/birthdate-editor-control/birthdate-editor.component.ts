import { Component, ElementRef, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BirthDateFormValue } from '@features/admin/people/new-family-form/person-form/person-form.model';

@Component( {
    selector: 'cm-birthdate-control',
    templateUrl: './birthdate-editor.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => BirthDateEditorComponent ),
            multi: true
        }
    ]
} )
export class BirthDateEditorComponent implements ControlValueAccessor, OnDestroy {

    private readonly _destroyed$: Subject<void> = new Subject();

    private readonly _dayPattern = '(0?[1-9]|[12]\\d|3[01])';
    private readonly _monthPattern = '^(0?[1-9]|1[012])$';
    private readonly _yearPattern = '^\\d{4}$';

    public form = new FormGroup( {
        day: new FormControl( null, [Validators.maxLength(2), Validators.pattern(this._dayPattern)] ),
        month: new FormControl( null, [Validators.maxLength(2), Validators.pattern(this._monthPattern)] ),
        year: new FormControl( null, [Validators.maxLength(4), Validators.pattern(this._yearPattern)] )
    } );

    constructor(
        private readonly _elementRef: ElementRef
    ) {
    }

    writeValue( birthDate: BirthDateFormValue ): void {
        if ( birthDate ) {
            this.form.patchValue( birthDate );
        }
    }

    registerOnChange( fn: any ): void {
        this.form
            .valueChanges
            .pipe(takeUntil(this._destroyed$))
            .subscribe(fn);
    }

    registerOnTouched( fn: any ): void {
        (this._elementRef.nativeElement as HTMLElement)
            .querySelector( 'input' )
            .addEventListener( 'blur', () => fn() );
    }

    setDisabledState?( isDisabled: boolean ): void {

    }

    ngOnDestroy() {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}