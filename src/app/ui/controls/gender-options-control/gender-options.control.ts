import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Identifiable } from '@shared/shared.models';
import { MatSelectChange } from '@angular/material/select';

@Component( {
    selector: 'cm-gender-field',
    templateUrl: './gender-options.control.html',
    styleUrls: ['./gender-options.control.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => GenderOptionsControl),
            multi: true
        }
    ]
} )
export class GenderOptionsControl implements ControlValueAccessor {

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    @Input() items: Identifiable[] = [
        {id: 'Male', label: 'Male'},
        {id: 'Female', label: 'Female'},
        {id: 'Unknown', label: 'Unknown'}
    ];

    @Input() appearance = 'standard'; // | 'outline';
    @Input() showLabel = true;
    @Input() label = 'Gender'; // overwritten from base
    @Output() selectionChange = new EventEmitter<MatSelectChange>();

    /**
     * Inner form control to link input text changes to mat select
     */
    inputControl = new FormControl( '',  [Validators.required] );

    onSelectionChange( selection: MatSelectChange ) {
        this.selectionChange.emit(selection);
        this.onTouched();
    }

    // model --> view
    writeValue(value: string): void {
        if (value) {
            this.inputControl.setValue(value, { emitEvent: false });
        } else {
            this.inputControl.reset('');
        }
    }

    // view --> model
    registerOnChange(fn: (value: string) => void) {
        this.inputControl
            .valueChanges
            .subscribe(fn);
    }

    registerOnTouched(fn: () => void) {
        this.onTouched = fn;
    }

    onTouched: () => void = () => {};
}