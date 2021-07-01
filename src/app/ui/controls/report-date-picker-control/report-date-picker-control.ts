import { Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import moment, { Moment } from 'moment';

export interface DateRangeSelect
{
    label: string;
    value: Moment[];
}

@Component({
    selector: 'report-date-picker-control',
    templateUrl: './report-date-picker-control.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ReportDatePickerControlComponent),
            multi: true
        }
    ]
})
export class ReportDatePickerControlComponent implements ControlValueAccessor, OnDestroy
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

    // current quarter
    quarter = moment().quarter();
    // minimum  possible date
    minDate: Moment = moment().subtract(30,'years');
    // maximum possible date
    maxDate: Moment = moment();

    /**
     * predefined date ranges
     */
    // https://www.codeproject.com/Questions/1165825/Daterange-picker-range-for-financtial-year
    items: DateRangeSelect[] = [
        { label: 'Today', value: [moment(), moment()] },
        { label: 'Yesterday', value: [moment().subtract(1, 'days'), moment().subtract(1, 'days')] },
        { label: 'Last 7 days', value: [moment().subtract(6,'days'), moment()] },
        { label: 'Last 30 days', value: [moment().subtract(29,'days'), moment()] },
        { label: 'This Month', value: [moment().startOf('month'), moment().endOf('month')] },
        { label: 'Last Month', value: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')] },
        { label: 'This Year', value: [moment().startOf('year'), moment().endOf('year')] },
        { label: 'Last Year', value: [moment().subtract(1,'years').startOf('year'), moment().subtract(1,'years').endOf('year')] },
        { label: 'Last 2 Years', value: [moment().subtract(2,'years').startOf('year'), moment().endOf('year')] },
        { label: 'This Quarter', value: [moment().quarter(this.quarter).startOf('quarter'), moment().quarter(this.quarter).endOf('quarter')] },
        { label: 'Last Quarter', value: [moment().subtract(1, 'quarter').startOf('quarter'), moment().subtract(1, 'quarter').endOf('quarter')] },
        { label: 'All Time', value: [moment().subtract(30,'years'), moment()]  }, // [minDate, maxDate]
    ];

    /**
     * select list form control
     */
    selectListControl = new FormControl('');


    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor()
    {
    }

    /**
     * model --> view
     */
    writeValue(value: DateRangeSelect): void
    {
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
    registerOnChange(fn: (value: string) => void)
    {
        this.selectListControl
            .valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(fn);
    }

    /**
     * model --> view
     */
    registerOnTouched(fn: () => void)
    {
        this.onTouched = fn;
    }

    onTouched: () => void = () => {};

    /**
     * On Selection Change - mark as touched
     */
    onSelectionChange(selection: MatSelectChange)
    {
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
