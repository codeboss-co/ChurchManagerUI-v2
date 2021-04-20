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
export class PersonFormDialogComponent implements OnInit {

    action: string;
    familyName: string;
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

        if ( this.action === 'edit' ) {
            this.dialogTitle = 'Edit Person';
            this.person = _data.person;
        } else {
            this.dialogTitle = 'New Person';
            this.familyName = _data['familyName'];
            this.person = new PersonModel( {} );
        }

        this.form = this.createForm();
    }

    ngOnInit(): void {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create person form
     *
     * @returns {FormGroup}
     */
    createForm(): FormGroup {
        return this._formBuilder.group( {
            church: [null, Validators.required],
            connectionStatus: [null, Validators.required],
            source: [null, Validators.required],
            firstVisitDate: [new Date()],
            person: [
                {
                    lastName: this.familyName
                },
                Validators.required
            ]
        } );
    }

    addPerson() {
        const churchId = this.form.get( 'church' ).value;
        const connectionStatus = this.form.get( 'connectionStatus' ).value;
        const source = this.form.get( 'source' ).value;
        const firstVisitDate = this.form.get( 'firstVisitDate' ).value;
        const person = this.form.get( 'person' ).value;

        const model: FamilyMember = {
            churchId,
            connectionStatus,
            source,
            firstVisitDate,
            person
        };

        this.matDialogRef.close( model );
    }
}