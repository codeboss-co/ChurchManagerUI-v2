import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GroupsDataService, GroupType, GroupWithChildren } from '@features/admin/groups';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { CalendarRecurrenceComponent, CalendarSettings, settings } from '../../../../../../pages/calendar';
import RRule from 'rrule';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { FormAction, FormActions } from '@shared/shared.models';


@Component({
    selector       : 'new-group-dialog',
    templateUrl    : './new-group-dialog.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewGroupDialogComponent implements OnInit, OnDestroy
{
    form: FormGroup;
    action: FormAction;

    settings: CalendarSettings = settings;

    groupType: GroupType;
    // new
    parentGroup?: GroupWithChildren
    // edit
    editGroup?: GroupWithChildren

    recurrenceStatus$: Observable<string>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<NewGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { action: FormAction, parentGroup?: GroupWithChildren, group?: GroupWithChildren },
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _formBuilder: FormBuilder,
        private _data: GroupsDataService
    )
    {
        this.action = data.action;

        if (this.action === FormActions.New)
        {
            this.parentGroup = data.parentGroup;
        }
        else
        {
            this.editGroup = data.group;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        const churchId = this.action === FormActions.New ? this.parentGroup?.churchId : this.editGroup?.churchId;
        console.log('this.this.editGroup ', this.editGroup , '');
        // Create the form
        this.form = this._formBuilder.group({
            churchId: [churchId, Validators.required],
            groupTypeId: [this.editGroup.groupType.id, Validators.required],
            parentGroupId: [this.parentGroup?.id, Validators.required],
            name: [this.editGroup.name, Validators.required],
            description: [this.editGroup.description],
            address: [this.editGroup.address],
            isOnline: [this.editGroup.isOnline],
            // Event
            meetingTime: [null],
            start           : [new Date()],
            end             : [null],
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
        //this.form.get('end').setValue(moment().year(9999).endOf('year').toISOString());
        this.form.get('end').reset(null);
    }
}