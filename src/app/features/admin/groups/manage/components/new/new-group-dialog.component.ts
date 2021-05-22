import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    OnDestroy,
    ViewEncapsulation,
    ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupsDataService, GroupType, GroupWithChildren } from '@features/admin/groups';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { CalendarRecurrenceComponent } from '../../../../../../pages/calendar/recurrence/recurrence.component';
import { weekdays, settings, CalendarSettings, CalendarWeekday } from '../../../../../../pages/calendar/calendar.types';
import RRule from 'rrule';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';


@Component({
    selector       : 'new-group-dialog',
    templateUrl    : './new-group-dialog.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewGroupDialogComponent implements OnInit, OnDestroy
{
    form: FormGroup;

    weekdays: CalendarWeekday[] = weekdays;
    settings: CalendarSettings = settings;

    groupType: GroupType;
    parentGroup: GroupWithChildren

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<NewGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { parentGroup: GroupWithChildren },
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _data: GroupsDataService
    )
    {
        this.parentGroup = data.parentGroup;
    }

    recurrenceStatus$: Observable<string>;

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for event's recurrence status
     */
    get recurrenceStatus(): string
    {
        // Get the recurrence from event form
        const recurrence = this.form.get('recurrence').value;

        // Return null, if there is no recurrence on the event
        if ( !recurrence )
        {
            return null;
        }

        // Convert the recurrence rule to text
        let ruleText = RRule.fromString(recurrence).toText();
        ruleText = ruleText.charAt(0).toUpperCase() + ruleText.slice(1);

        // Return the rule text
        return ruleText;
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.form = this._formBuilder.group({
            groupTypeId: [null, Validators.required],
            parentGroupId: [this.parentGroup?.id, Validators.required],
            name: [null, Validators.required],
            description: [null],
            meetingTime: [],

            // Event
            start           : [new Date()],
            end             : [new Date()],
            duration        : [null],
            recurrence      : [null]
        });

        // Subscribe to groupTypeId field value changes to get  the group type info
        this.form.get('groupTypeId').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                switchMap(groupTypeId => this._data.getGroupType$(groupTypeId)),
                map(data => this.groupType = data)
            ).subscribe();

        // Subscribe to 'recurrence' field changes
        this.form.get('recurrence').valueChanges.subscribe((value) => {

            // If this is a recurring event...
            if ( value )
            {
                // Update the end value
                this._updateEndValue();
            }
        });

        //  Event's recurrence status in plain english
        this.recurrenceStatus$ = this.form.get('recurrence').valueChanges
            .pipe(
                map(recurrence => {
                    // Return null, if there is no recurrence on the event
                    if ( !recurrence )
                    {
                        return null;
                    }

                    // Convert the recurrence rule to text
                    let ruleText = RRule.fromString(recurrence).toText();
                    ruleText = ruleText.charAt(0).toUpperCase() + ruleText.slice(1);

                    // Return the rule text
                    return ruleText;
                })
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open recurrence panel
     */
    openRecurrenceDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(CalendarRecurrenceComponent, {
            panelClass: 'calendar-event-recurrence-dialog',
            data      : {
                event: this.form.value
            }
        });

        // After dialog closed
        dialogRef.afterClosed().subscribe((result) => {
            console.log('result', result, '');
            // Return if canceled
            if ( !result || !result.recurrence )
            {
                return;
            }

            // Only update the recurrence if it actually changed
            if ( this.form.get('recurrence').value === result.recurrence )
            {
                return;
            }

            // If returned value is 'cleared'...
            if ( result.recurrence === 'cleared' )
            {
                // Clear the recurrence field if recurrence cleared
                this.form.get('recurrence').setValue(null);
            }
            // Otherwise...
            else
            {
                // Update the recurrence field with the result
                this.form.get('recurrence').setValue(result.recurrence);
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the recurrence rule based on the event if needed
     *
     * @private
     */
    private _updateRecurrenceRule(): void
    {
        // Get the event
        const event = this.form.value;

        // Return if this is a non-recurring event
        if ( !event.recurrence )
        {
            return;
        }

        // Parse the recurrence rule
        const parsedRules = {};
        event.recurrence.split(';').forEach((rule) => {

            // Split the rule
            const parsedRule = rule.split('=');

            // Add the rule to the parsed rules
            parsedRules[parsedRule[0]] = parsedRule[1];
        });

        // If there is a BYDAY rule, split that as well
        if ( parsedRules['BYDAY'] )
        {
            parsedRules['BYDAY'] = parsedRules['BYDAY'].split(',');
        }

        // Do not update the recurrence rule if ...
        // ... the frequency is DAILY,
        // ... the frequency is WEEKLY and BYDAY has multiple values,
        // ... the frequency is MONTHLY and there isn't a BYDAY rule,
        // ... the frequency is YEARLY,
        if ( parsedRules['FREQ'] === 'DAILY' ||
            (parsedRules['FREQ'] === 'WEEKLY' && parsedRules['BYDAY'].length > 1) ||
            (parsedRules['FREQ'] === 'MONTHLY' && !parsedRules['BYDAY']) ||
            parsedRules['FREQ'] === 'YEARLY' )
        {
            return;
        }

        // If the frequency is WEEKLY, update the BYDAY value with the new one
        if ( parsedRules['FREQ'] === 'WEEKLY' )
        {
            parsedRules['BYDAY'] = [moment(event.start).format('dd').toUpperCase()];
        }

        // If the frequency is MONTHLY, update the BYDAY value with the new one
        if ( parsedRules['FREQ'] === 'MONTHLY' )
        {
            // Calculate the weekday
            const weekday = moment(event.start).format('dd').toUpperCase();

            // Calculate the nthWeekday
            let nthWeekdayNo = 1;
            while ( moment(event.start).isSame(moment(event.start).subtract(nthWeekdayNo, 'week'), 'month') )
            {
                nthWeekdayNo++;
            }

            // Set the BYDAY
            parsedRules['BYDAY'] = [nthWeekdayNo + weekday];
        }

        // Generate the rule string from the parsed rules
        const rules = [];
        Object.keys(parsedRules).forEach((key) => {
            rules.push(key + '=' + (Array.isArray(parsedRules[key]) ? parsedRules[key].join(',') : parsedRules[key]));
        });
        const rrule = rules.join(';');

        // Update the recurrence rule
        this.form.get('recurrence').setValue(rrule);
    }

    /**
     * Update the end value based on the recurrence and duration
     *
     * @private
     */
    private _updateEndValue(): void
    {
        // Get the event recurrence
        const recurrence = this.form.get('recurrence').value;

        // Return if this is a non-recurring event
        if ( !recurrence )
        {
            return;
        }

        // Parse the recurrence rule
        const parsedRules = {};
        recurrence.split(';').forEach((rule) => {

            // Split the rule
            const parsedRule = rule.split('=');

            // Add the rule to the parsed rules
            parsedRules[parsedRule[0]] = parsedRule[1];
        });

        // If there is an UNTIL rule...
        if ( parsedRules['UNTIL'] )
        {
            // Use that to set the end date
            this.form.get('end').setValue(parsedRules['UNTIL']);

            // Return
            return;
        }

        // If there is a COUNT rule...
        if ( parsedRules['COUNT'] )
        {
            // Generate the RRule string
            const rrule = 'DTSTART=' + moment(this.form.get('start').value).utc().format('YYYYMMDD[T]HHmmss[Z]') + '\nRRULE:' + recurrence;

            // Use RRule string to generate dates
            const dates = RRule.fromString(rrule).all();

            // Get the last date from dates array and set that as the end date
            this.form.get('end').setValue(moment(dates[dates.length - 1]).toISOString());

            // Return
            return;
        }

        // If there are no UNTIL or COUNT, set the end date to a fixed value
        this.form.get('end').setValue(moment().year(9999).endOf('year').toISOString());
    }

    updateStartTime($event: FocusEvent)
    {
        console.log($event);
    }
}