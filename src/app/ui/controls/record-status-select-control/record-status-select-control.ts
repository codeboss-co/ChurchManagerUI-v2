import { Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'record-status-select-control',
    templateUrl: './record-status-select-control.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RecordStatusSelectControlComponent),
            multi: true
        }
    ]
})
export class RecordStatusSelectControlComponent implements ControlValueAccessor, OnDestroy
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
     * select list form control
     */
    selectListControl = new FormControl('Active');

    /**
     * select items observable
     */
    items: string[] = ['Active', 'Pending', 'Inactive'];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * model --> view
     */
    writeValue(value: string): void {
        if (value) {
            this.selectListControl.setValue(value, { emitEvent: false });
        } else {
            this.selectListControl.reset(null);
        }
    }

    /**
     * view --> model
     *  When a form value changes due to user input, we need to report the value back to the parent form
     */
    registerOnChange(fn: (value: string) => void) {
        this.selectListControl
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
     * On Selection Change - mark as touched
     */
    onSelectionChange(selection: MatSelectChange) {
        this.selectionChange.emit(selection);
        this.onTouched();
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
}
