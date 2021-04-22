import { Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChurchGroupsSelectControlDataService } from '../church-groups-select-control/church-groups-select-control-data.service';
import { Observable, Subject } from 'rxjs';
import { SelectItem } from '@shared/shared.models';
import { takeUntil } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';

@Component({
    selector: 'churches-select-control',
    templateUrl: './churches-select-control.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ChurchesSelectControlComponent),
            multi: true
        }
    ]
})
export class ChurchesSelectControlComponent implements ControlValueAccessor, OnDestroy
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
    selectListControl = new FormControl('');

    /**
     * select items observable
     */
    items$: Observable<SelectItem[]> = this._data.getChurches$();

    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChurchGroupsSelectControlDataService} _data
     */
    constructor(private _data: ChurchGroupsSelectControlDataService)
    {
        this._unsubscribeAll = new Subject();
    }

    /**
     * model --> view
     */
    writeValue(value: number): void {
        if (value) {
            this.selectListControl.setValue(value, { emitEvent: false });
        } else {
            this.selectListControl.reset('');
        }
    }

    /**
     * view --> model
     */
    registerOnChange(fn: (value: number) => void) {
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
