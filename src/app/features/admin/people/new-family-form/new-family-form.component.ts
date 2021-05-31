import { Component, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PersonFormDialogComponent } from './person-form/person-form-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import { FamilyMember, NewFamilyForm, PersonBasicDetailsForm } from './person-form/person-form.model';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { PeopleDataService } from '../_services/people-data.service';
import { first } from 'rxjs/operators';

@Component({
    selector     : 'people-family-form-dialog',
    templateUrl  : './new-family-form.component.html',
    styleUrls    : ['./new-family-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    viewProviders: [MatExpansionPanel] // <----- Here
})
export class NewFamilyFormComponent {

    dialogRef: any;

    addressFormStep1: FormGroup;
    familyFormStep2: FormGroup;

    familyMembers: PersonBasicDetailsForm[] = [];
    familyMembers$ = new BehaviorSubject<PersonBasicDetailsForm[]>([]);

    displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'ageClassification'];
    dataSource: MatTableDataSource<PersonBasicDetailsForm> = new MatTableDataSource([]);

    constructor(
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _data: PeopleDataService)
    {
        this.familyFormStep2 = this.createForm();

        // Address Stepper form step
        this.addressFormStep1 = this._formBuilder.group({
            address: [null, Validators.required],
        });
    }

    /**
     * Create new family form
     *
     * @returns {FormGroup}
     */
    createForm(): FormGroup
    {
        return this._formBuilder.group({
            familyName:  ['', Validators.required],
            members: this._formBuilder.array([], Validators.required)
        });
    }

    newPerson()
    {
        this.dialogRef = this._matDialog.open(PersonFormDialogComponent, {
            panelClass: 'person-form-dialog',
            data      : {
                action: 'new',
                familyName: this.familyFormStep2.get('familyName').value
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FamilyMember) => {
                if ( !response )
                {
                    return;
                }

                // Do something here
                this._addFamilyMember(response);
            });
    }

    /*
     * Access to the Groups Members Form item
     */
    public get familyMembersFormArray(): FormArray
    {
        return this.familyFormStep2.get('members') as FormArray;
    }

    // Adds a new Family Member Form Array item
    private _addFamilyMember(model: FamilyMember)
    {
        this.familyMembersFormArray.push(this._formBuilder.control(model));
        // We need to create a new reference for OnPush to work on the other side
        const newMergedFamily = [...this.familyMembers, model.person];
        this.familyMembers = newMergedFamily;
        this.familyMembers$.next(newMergedFamily);
    }

    saveFamily()
    {
        const address = this.addressFormStep1.get('address').value;
        const familyName = this.familyFormStep2.get('familyName').value;
        const members = this.familyFormStep2.get('members').value;

        const family: NewFamilyForm = { familyName, address, members };

        this._data.addNewFamily$(family)
            .pipe(first())
            .subscribe();
    }
}
