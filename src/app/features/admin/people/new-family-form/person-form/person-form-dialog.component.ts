import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Person, PersonModel } from '../../people.model';
import { FamilyMember } from './person-form.model';

@Component( {
    selector: 'people-person-form-dialog',
    templateUrl: './person-form-dialog.component.html',
    styleUrls: ['./person-form-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
} )
export class PersonFormDialogComponent implements OnInit
{
    action: string;
    familyName: string;
    familyId?: number;
    person: Person;
    form: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<GroupAttendanceFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<PersonFormDialogComponent>,
        @Inject( MAT_DIALOG_DATA ) private _data: any,
        private _formBuilder: FormBuilder
    ) {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Person';
            this.person = _data.person;
        } else
        {
            this.dialogTitle = 'New Person';
            this.familyName = _data['familyName'];
            this.person = new PersonModel( {} );

            // Adding a Person to the Family
            if (this.action === 'add_person')
            {
                if(!_data['familyId'])
                {
                    throw new Error('familyId is required to add a person');
                }


                this.familyId = _data['familyId'];
            }
        }

        this.form = this.createForm();
    }

    ngOnInit(): void
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create person form
     *
     * @returns {FormGroup}
     */
    createForm(): FormGroup
    {
        return this._formBuilder.group(
            {
            church: [1, Validators.required],
            connectionStatus: ['Member', Validators.required],
            source: ['Cell', Validators.required],
            firstVisitDate: [new Date()],
            person: [
                {
                    lastName: this.familyName
                },
                Validators.required
            ],
            assignedFollowUpPerson: [null]
        } );
    }

    addPerson(): void
    {
        const churchId = this.form.get( 'church' ).value;
        const {connectionStatus, source, firstVisitDate, person, assignedFollowUpPerson} = this.form.value;

        const model: FamilyMember = {
            churchId,
            familyId: this.familyId,
            connectionStatus,
            source,
            firstVisitDate,
            person,
            assignedFollowUpPerson
        };
        console.log(model);
        this.matDialogRef.close( model );
    }
}